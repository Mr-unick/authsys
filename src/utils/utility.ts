

export function formatDateToShow(originalDate) {
    const date = new Date(originalDate); 
    date.setDate(date.getDate() - 7); 
    date.setHours(1, 30, 0, 0); 
  
   // hello
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
  

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

export const formatDateTime = (timestamp) => {
  const date = new Date(timestamp);

  // Format the date as '28 March 2025'
  const options = { day: '2-digit', month: 'long', year: 'numeric' };
  const formattedDate = date.toLocaleDateString('en-GB');  // '28 March 2025'

  // Format the time as '06:49:37'
  const timeString = date.toISOString().split('T')[1].slice(0, 8);  // '06:49:37'

  return formattedDate+','+timeString ;
};


export function mapLeadSourcesToChartData(sources) {
  const colors = [
    'hsl(240, 100%, 50%)',
    'hsl(215, 100%, 50%)',
    'hsl(210, 80%, 55%)',
    'hsl(190, 70%, 50%)',
    'hsl(170, 60%, 50%)',
    'hsl(150, 50%, 50%)',
    'hsl(130, 40%, 50%)',
    'hsl(110, 30%, 50%)',
    'hsl(90, 20%, 50%)',
    'hsl(70, 10%, 50%)'
  ];

  const chartData = sources.map((source, index) => {
   // const key = source.source.replace(/\s+/g, '_').toLowerCase(); // sanitize key
    return {
      label: source.source,
      value: parseInt(source.count),
      fill: colors[index % colors.length] // loop through colors if more sources
    };
  });

  return chartData;
}


  

  