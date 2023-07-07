export function isNumber(evt: any) {
  evt = evt ? evt : window.event;
  const charCode = evt.which ? evt.which : evt.keyCode;
  if (
    (charCode > 31 && (charCode < 48 || charCode > 57)) &&
    charCode !== 46 &&
    charCode !== 45
  ) {
    evt.preventDefault();
  } else {
    return true;
  }
}
export interface Model {
  KP: number;
  X: number;
  Y: number;
  Z: number;
}

export function findMinMax(data: Model[]): { max_X: number, min_X: number, max_Y: number, min_Y: number, max_Z: number, min_Z: number } {
  let max_X = -Infinity;
  let min_X = Infinity;
  let max_Y = -Infinity;
  let min_Y = Infinity;
  let max_Z = -Infinity;
  let min_Z = Infinity;

  for (const entry of data) {
    max_X = Math.max(max_X, entry.X);
    min_X = Math.min(min_X, entry.X);
    max_Y = Math.max(max_Y, entry.Y);
    min_Y = Math.min(min_Y, entry.Y);
    max_Z = Math.max(max_Z, entry.Z);
    min_Z = Math.min(min_Z, entry.Z);
  }
  return { max_X, min_X, max_Y, min_Y, max_Z, min_Z };
}

export function parseCSV(contents: string): Model[] {
  const lines = contents.split('\n');
  const headers = lines[0].split(',');

  const data: Model[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length === headers.length) {
      const entry: Model = {
        KP: parseInt(values[0], 10),
        X: parseFloat(values[1]),
        Y: parseFloat(values[2]),
        Z: parseFloat(values[3]),
      };
      data.push(entry);
    }
  }
  return data;
}
