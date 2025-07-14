exports.formatTimeAgo = (date) => {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  const units = [
    { limit: 60, label: 's', divisor: 1 },
    { limit: 3600, label: 'min', divisor: 60 },
    { limit: 86400, label: 'h', divisor: 3600 },
    { limit: 604800, label: 'd', divisor: 86400 },
    { limit: 2629800, label: 'sem', divisor: 604800 }, 
    { limit: 31557600, label: 'mes', divisor: 2629800 },
    { limit: Infinity, label: 'a', divisor: 31557600 }
  ];

  for (const unit of units) {
    if (diff < unit.limit) {
      return `${Math.floor(diff / unit.divisor)} ${unit.label}`;
    }
  }

  return '';
};

exports.formatMessageTimestamp = (dateInput) => {
  const date = new Date(dateInput);

  const day = date.getDate().toString().padStart(2, '0');
  const monthNames = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';

  hours = hours % 12;
  if (hours === 0) hours = 12;

  return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
};
