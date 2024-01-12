
import { Pie } from 'react-chartjs-2';

type Props = {
    labels: string[];
    data: number[];
  };

function PieChart({labels, data}: Props) {
    const colours: string[] = []
    for (let i=0, ;i <labels.length; i++) {
        const start = 'rgba('
        const r = Math.floor(Math.random() * 255)
        const b = Math.floor(Math.random() * 255)
        const g = Math.floor(Math.random() * 255)
        const col = start + r + ", " + b + ", " + g + ", 0.6)"
        colours.push(col)
    };

    const chartdata = {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: colours,
          },
        ],
      };
  return (
    <div>
        <Pie data={chartdata}/>
    </div>
  )
}
export default PieChart;