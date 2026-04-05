export function toCSV(arr, fields) {
  if (!arr || arr.length === 0) return '';
  const keys = fields || Object.keys(arr[0]);
  const lines = [keys.join(',')];
  for (const item of arr) {
    const row = keys.map((k) => {
      const v = item[k] === undefined || item[k] === null ? '' : String(item[k]);
      // escape quotes
      if (v.includes(',') || v.includes('"') || v.includes('\n')) return '"' + v.replace(/"/g, '""') + '"';
      return v;
    });
    lines.push(row.join(','));
  }
  return lines.join('\n');
}

export function downloadFile(filename, content, mime = 'text/plain') {
  const blob = new Blob([content], { type: mime + ';charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
