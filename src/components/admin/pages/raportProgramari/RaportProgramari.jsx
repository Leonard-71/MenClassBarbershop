import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker, { registerLocale } from "react-datepicker";
import ro from "date-fns/locale/ro";
import "react-datepicker/dist/react-datepicker.css";
import "./RaportProgramari.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faFileExcel, faFileCsv } from "@fortawesome/free-solid-svg-icons";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { CSVLink } from "react-csv";

registerLocale("ro", ro);

const RaportProgramari = ({ token }) => {
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState({});
  const [employees, setEmployees] = useState([]);
  const [clients, setClients] = useState({});
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [searchKeyword] = useState("");

  const [mostRequestedService, setMostRequestedService] = useState("");
  const [mostRequestedEmployee, setMostRequestedEmployee] = useState({ nume: "lipsa", prenume: "" });
  const [totalObtained, setTotalObtained] = useState(0);
  const [serviceTotals, setServiceTotals] = useState({});

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get("http://localhost:5050/api/programari", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const appointmentsData = response.data;

        const clientIds = appointmentsData
          .filter(appointment => appointment.clientId !== 0)
          .map(appointment => appointment.clientId);

        const uniqueClientIds = [...new Set(clientIds)];
        const clientPromises = uniqueClientIds.map(id =>
          axios.get(`http://localhost:5050/admin/users/id/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        );

        const clientResponses = await Promise.all(clientPromises);
        const clientsData = clientResponses.reduce((acc, response) => {
          const client = response.data;
          acc[client.utilizatorId] = client;
          return acc;
        }, {});
        setClients(clientsData);

        const servicesResponse = await axios.get("http://localhost:5050/api/servicii", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const servicesData = servicesResponse.data.reduce((acc, service) => {
          acc[service.serviciuId] = { denumire: service.denumire, pret: service.pret };
          return acc;
        }, {});
        setServices(servicesData);

        const employeesResponse = await axios.get("http://localhost:5050/api/angajati", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const employeesData = employeesResponse.data;
        setEmployees(employeesData);

        setAppointments(appointmentsData);

        calculateAdditionalData(appointmentsData, servicesData, employeesData, clientsData);
      } catch (error) {
        console.error("Eroare la preluarea datelor:", error);
      }
    };

    fetchAppointments();
  }, [token]);

  const calculateAdditionalData = (appointmentsData, servicesData, employeesData, clientsData) => {
    const filteredAppointments = appointmentsData.filter(appointment => {
      const appointmentDate = new Date(appointment.dataProgramare);
      return (
        appointmentDate >= startDate &&
        appointmentDate <= endDate &&
        (selectedEmployee === "" || appointment.angajatId === parseInt(selectedEmployee)) &&
        (selectedService === "" || appointment.serviciuId === parseInt(selectedService)) &&
        (searchKeyword === "" ||
         clients[appointment.clientId]?.nume?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
         clients[appointment.clientId]?.prenume?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
         clients[appointment.clientId]?.telefon?.includes(searchKeyword))
      );
    });

    const serviceCount = {};
    const employeeCount = {};
    const serviceTotals = {};
    let totalObtained = 0;

    filteredAppointments.forEach(appointment => {
      const serviceId = appointment.serviciuId;
      const employeeId = appointment.angajatId;
      serviceCount[serviceId] = (serviceCount[serviceId] || 0) + 1;
      employeeCount[employeeId] = (employeeCount[employeeId] || 0) + 1;
      const servicePrice = servicesData[serviceId]?.pret || 0;
      serviceTotals[serviceId] = (serviceTotals[serviceId] || 0) + servicePrice;
      totalObtained += servicePrice;
    });

    const mostRequestedServiceId = Object.keys(serviceCount).reduce((a, b) => serviceCount[a] > serviceCount[b] ? a : b, null);
    const mostRequestedEmployeeId = Object.keys(employeeCount).reduce((a, b) => employeeCount[a] > employeeCount[b] ? a : b, null);

    setMostRequestedService(mostRequestedServiceId ? servicesData[mostRequestedServiceId]?.denumire : "lipsa");
    setMostRequestedEmployee(mostRequestedEmployeeId ? employeesData.find(emp => emp.angajatId === parseInt(mostRequestedEmployeeId)) : { nume: "lipsa", prenume: "" });
    setTotalObtained(totalObtained);
    setServiceTotals(serviceTotals);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('ro-RO', options);
  };

  const formatTime = (timeString) => {
    const [hour, minute] = timeString.split(':');
    return `${hour}:${minute}`;
  };

  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.dataProgramare);
    return (
      appointmentDate >= startDate &&
      appointmentDate <= endDate &&
      (selectedEmployee === "" || appointment.angajatId === parseInt(selectedEmployee)) &&
      (selectedService === "" || appointment.serviciuId === parseInt(selectedService)) &&
      (searchKeyword === "" ||
       clients[appointment.clientId]?.nume?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
       clients[appointment.clientId]?.prenume?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
       clients[appointment.clientId]?.telefon?.includes(searchKeyword))
    );
  });

  const generatePDF = () => {
    const doc = new jsPDF();
    const fontSize = 13;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40);
    doc.text("Raport programari", 14, 15);
  
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    doc.text(`Data de inceput: ${formatDate(startDate.toString())}`, 14, 30);
    doc.text(`Data de sfarsit: ${formatDate(endDate.toString())}`, 14, 40);
    doc.text(`Angajat: ${selectedEmployee ? employees.find(emp => emp.angajatId === parseInt(selectedEmployee))?.nume + ' ' + employees.find(emp => emp.angajatId === parseInt(selectedEmployee))?.prenume || "lipsa" : "toti angajatii"}`, 14, 50);
    doc.text(`Serviciu: ${selectedService ? services[selectedService]?.denumire : "toate serviciile"}`, 14, 60);
  
    doc.autoTable({
      startY: 70,
      head: [['Nume', 'Prenume', 'Telefon', 'Serviciu', 'Angajat', 'Data', 'Ora']],
      body: filteredAppointments.map(appointment => {
        const client = clients[appointment.clientId] || {};
        const employee = employees.find(emp => emp.angajatId === appointment.angajatId) || { nume: "lipsa", prenume: "" };
        return [
          client.nume || appointment.nume,
          client.prenume || appointment.prenume,
          client.telefon || appointment.telefon,
          services[appointment.serviciuId]?.denumire || "lipsa",
          `${employee.nume} ${employee.prenume}`,
          formatDate(appointment.dataProgramare),
          formatTime(appointment.oraProgramare)
        ];
      }),
      styles: {
        fontSize: fontSize,
        cellPadding: 3,
        overflow: 'linebreak',
      },
      headStyles: {
        fillColor: [26, 37, 50],
        textColor: [255, 255, 255],
      },
      alternateRowStyles: {
        fillColor: [124, 140, 165],
        textColor: [255, 255, 255],
      },
      bodyStyles: {
        fillColor: [67, 101, 142],
        textColor: [255, 255, 255],
      },
    });
  
    // Verifică înălțimea curentă a paginii și adaugă o pagină nouă dacă este necesar
    const finalY = doc.lastAutoTable.finalY;
    if (finalY > 250) { // 250 este un prag aproximativ, poți ajusta acest număr în funcție de layout-ul tău
      doc.addPage();
    }
  
    const filteredServiceTotals = filteredAppointments.reduce((acc, appointment) => {
      const serviceId = appointment.serviciuId;
      const servicePrice = services[serviceId]?.pret || 0;
      acc[serviceId] = (acc[serviceId] || 0) + servicePrice;
      return acc;
    }, {});
  
    const filteredTotalObtained = filteredAppointments.reduce((total, appointment) => {
      const servicePrice = services[appointment.serviciuId]?.pret || 0;
      return total + servicePrice;
    }, 0);
  
    // Adaugă un spațiu suplimentar la finalul paginii
    doc.text(" ", 14, finalY + 10);
  
    doc.text(`Cel mai cautat serviciu de catre clienti este: ${mostRequestedService.toLowerCase()}`, 14, finalY + 20);
    doc.text(`Angajatul ce are cele mai multe programari este: ${mostRequestedEmployee.nume} ${mostRequestedEmployee.prenume}`, 14, finalY + 30);
    doc.text(`Totalul obtinut din prestarea serviciilor este de: ${filteredTotalObtained} lei`, 14, finalY + 40);
  
    Object.keys(filteredServiceTotals).forEach((serviceId, index) => {
      const serviceName = services[serviceId]?.denumire || "lipsa";
      const totalForService = filteredServiceTotals[serviceId];
      doc.text(`Totalul obtinut pentru serviciul ${serviceName.toLowerCase()} este: ${totalForService} lei`, 14, finalY + 50 + (index * 10));
    });
  
    doc.save("programari_menclass.pdf");
  };
  
  

  const generateExcel = () => {
    const data = filteredAppointments.map(appointment => {
      const client = clients[appointment.clientId] || {};
      const employee = employees.find(emp => emp.angajatId === appointment.angajatId) || { nume: "lipsa", prenume: "" };
      return {
        Nume: client.nume || appointment.nume,
        Prenume: client.prenume || appointment.prenume,
        Telefon: client.telefon || appointment.telefon,
        Serviciu: services[appointment.serviciuId]?.denumire || "lipsa",
        Angajat: `${employee.nume} ${employee.prenume}`,
        Data: formatDate(appointment.dataProgramare),
        Ora: formatTime(appointment.oraProgramare),
        Pret: services[appointment.serviciuId]?.pret || 0 
      };
    });

    const filteredServiceTotals = filteredAppointments.reduce((acc, appointment) => {
      const serviceId = appointment.serviciuId;
      const servicePrice = services[serviceId]?.pret || 0;
      acc[serviceId] = (acc[serviceId] || 0) + servicePrice;
      return acc;
    }, {});

    const filteredTotalObtained = filteredAppointments.reduce((total, appointment) => {
      const servicePrice = services[appointment.serviciuId]?.pret || 0;
      return total + servicePrice;
    }, 0);

    const summaryData = [
      { Label: 'Cel mai solicitat serviciu', Value: mostRequestedService },
      { Label: 'Cel mai solicitat angajat', Value: `${mostRequestedEmployee.nume} ${mostRequestedEmployee.prenume}` },
      { Label: 'Totalul obtinut', Value: filteredTotalObtained },
      ...Object.keys(filteredServiceTotals).map(serviceId => ({
        Label: `Totalul obtinut pentru ${services[serviceId]?.denumire || "lipsa"}`,
        Value: filteredServiceTotals[serviceId]
      }))
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Raport Programari");
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Sumar");

    XLSX.writeFile(workbook, "raport_programari-menclass.xlsx");
  };

  const csvData = filteredAppointments.map(appointment => {
    const client = clients[appointment.clientId] || {};
    const employee = employees.find(emp => emp.angajatId === appointment.angajatId) || { nume: "lipsa", prenume: "" };
    return {
      Nume: client.nume || appointment.nume,
      Prenume: client.prenume || appointment.prenume,
      Telefon: client.telefon || appointment.telefon,
      Serviciu: services[appointment.serviciuId]?.denumire || "lipsa",
      Angajat: `${employee.nume} ${employee.prenume}`,
      Data: formatDate(appointment.dataProgramare),
      Ora: formatTime(appointment.oraProgramare),
      Pret: services[appointment.serviciuId]?.pret || 0  
    };
  });

  return (
    <div className="raport-programari">
      <h2>Raport Programări</h2>
      <div className="filter-container-raport-programari">
        <div className="filter-group-raport-programari">
          <label>Data de început</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="dd/MM/yyyy"
            locale="ro"
            className="date-picker-raport-programari"
            placeholderText="Selectează data"
          />
        </div>
        <div className="filter-group-raport-programari">
          <label>Data de sfârșit</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="dd/MM/yyyy"
            locale="ro"
            className="date-picker-raport-programari"
            placeholderText="Selectează data"
          />
        </div>
        <div className="filter-group-raport-programari">
          <label>Selectează un angajat</label>
          <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}>
            <option value="">Toți angajații</option>
            {employees.map((employee) => (
              <option key={employee.angajatId} value={employee.angajatId}>
                {employee.nume} {employee.prenume}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group-raport-programari">
          <label>Selectează un serviciu</label>
          <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
            <option value="">Toate serviciile</option>
            {Object.entries(services).map(([id, { denumire }]) => (
              <option key={id} value={id}>
                {denumire}
              </option>
            ))}
          </select>
        </div>
      </div>
      <table className="appointments-table-raport-programari">
        <thead>
          <tr>
            <th>Nume</th>
            <th>Prenume</th>
            <th>Telefon</th>
            <th>Serviciu</th>
            <th>Angajat</th>
            <th>Data</th>
            <th>Ora</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.map((appointment) => {
            const client = clients[appointment.clientId] || {};
            const employee = employees.find(emp => emp.angajatId === appointment.angajatId) || { nume: "lipsa", prenume: "" };
            return (
              <tr key={appointment.programareId}>
                <td>{client.nume || appointment.nume}</td>
                <td>{client.prenume || appointment.prenume}</td>
                <td>{client.telefon || appointment.telefon}</td>
                <td>{services[appointment.serviciuId]?.denumire || "lipsa"}</td>
                <td>{employee.nume} {employee.prenume}</td>
                <td>{formatDate(appointment.dataProgramare)}</td>
                <td>{formatTime(appointment.oraProgramare)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="export-buttons-raport-programari">
        <button onClick={generatePDF} className="export-button">
          <FontAwesomeIcon icon={faFilePdf} /> Export PDF
        </button>
        <button onClick={generateExcel} className="export-button">
          <FontAwesomeIcon icon={faFileExcel} /> Export Excel
        </button>
        <CSVLink
          data={csvData}
          headers={[
            { label: "Nume", key: "Nume" },
            { label: "Prenume", key: "Prenume" },
            { label: "Telefon", key: "Telefon" },
            { label: "Serviciu", key: "Serviciu" },
            { label: "Angajat", key: "Angajat" },
            { label: "Data", key: "Data" },
            { label: "Ora", key: "Ora" },
            { label: "Pret", key: "Pret" }
          ]}
          filename={"raport_programari-menclass.csv"}
          className="export-button"
        >
          <FontAwesomeIcon icon={faFileCsv} /> Export CSV
        </CSVLink>
      </div>
    </div>
  );
};

export default RaportProgramari;
