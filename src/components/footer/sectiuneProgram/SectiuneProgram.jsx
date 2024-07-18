import React, { Component } from "react";
import './SectiuneProgram.scss';
import { fetchProgramLucru } from '../../../Service/program';

class SectiuneProgram extends Component {
  constructor(props) {
    super(props);
    this.state = {
      program: []
    };
  }

  componentDidMount() {
    this.loadProgram();
  }

  loadProgram = async () => {
    try {
      const data = await fetchProgramLucru();
      const formattedData = data.map(item => ({
        ...item,
        program: {
          start: this.formatTime(item.oraDeschidere),
          end: this.formatTime(item.oraInchidere)
        }
      }));
      this.setState({ program: formattedData });
    } catch (error) {
      console.error('Eroare la preluarea programului:', error);
    }
  };

  formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    return `${parseInt(hours)}:${minutes.padStart(2, '0')}`;
  };

  convertToRomanianStatus = (status) => {
    return status === "Închis" ? "Închis" : status;
  };

  renderProgram = () => {
    const { program } = this.state;
    const validDays = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică'];
    const sortedProgram = program.sort((a, b) => validDays.indexOf(a.denumire) - validDays.indexOf(b.denumire));
    
    let groupedProgram = [];
    let currentGroup = [];

    for (let i = 0; i < sortedProgram.length; i++) {
      const currentDay = sortedProgram[i];
      const nextDay = sortedProgram[i + 1];

      currentGroup.push(currentDay);

      if (!nextDay || nextDay.program.start !== currentDay.program.start || nextDay.program.end !== currentDay.program.end) {
        groupedProgram.push(currentGroup);
        currentGroup = [];
      }
    }

    return groupedProgram.map((group, index) => {
      const start = group[0].program.start === group[0].program.end ? "Închis" : group[0].program.start;
      const end = group[0].program.end === group[0].program.start ? "" : group[0].program.end;
      const days = group.map(day => day.denumire);

      let dayRange = days[0];
      if (days.length > 1) {
        dayRange += ` - ${days[days.length - 1]}`;
      }

      let endStatus = this.convertToRomanianStatus(end);
      let startStatus = this.convertToRomanianStatus(start);

      if (startStatus === "Închis") {
        return (
          <div key={index} className="item">
            <p>{`${dayRange}: ${startStatus}`}</p>
          </div>
        );
      } else {
        return (
          <div key={index} className="item">
            <p>{`${dayRange}: ${startStatus} - ${endStatus}`}</p>
          </div>
        );
      }
    });
  };

  render() {
    return (
      <div className="sectiune-program">
        <h2>PROGRAMUL NOSTRU</h2>
        <div className="program">
          {this.renderProgram()}
        </div>
      </div>
    );
  }
}

export default SectiuneProgram;
