
import { writeFile } from "fs";

export const outputAsFile = async (fileName: string, data: string) => {
  await writeFile(fileName, data, (err) => {
    if (err) throw err;
    console.log(`✅Successfully write data to ${fileName}`);
  });
}