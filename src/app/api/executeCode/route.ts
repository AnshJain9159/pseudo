// pages/api/executeCode.js
import { exec } from "child_process";
import fs from "fs";
import path from "path";

export default async function handler(req: { method: string; body: { code: any; language: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { output: string; }): void; new(): any; }; }; }) {
  if (req.method === "POST") {
    const { code, language } = req.body;

    const executeCode = (command: string, fileName: string, extension: string) => {
      const filePath = path.join("/tmp", `${fileName}.${extension}`);
      fs.writeFileSync(filePath, code);
      
      exec(command, (error, stdout, stderr) => {
        fs.unlinkSync(filePath); // Clean up file
        if (error) {
          res.status(500).json({ output: stderr });
        } else {
          res.status(200).json({ output: stdout });
        }
      });
    };

    if (language === "python") {
      exec(`python3 -c "${code}"`, (error, stdout, stderr) => {
        if (error) {
          res.status(500).json({ output: stderr });
        } else {
          res.status(200).json({ output: stdout });
        }
      });
    } else if (language === "cpp") {
      const fileName = `code_${Date.now()}`;
      executeCode(`g++ /tmp/${fileName}.cpp -o /tmp/${fileName} && /tmp/${fileName}`, fileName, "cpp");
    } else if (language === "c") {
      const fileName = `code_${Date.now()}`;
      executeCode(`gcc /tmp/${fileName}.c -o /tmp/${fileName} && /tmp/${fileName}`, fileName, "c");
    } else if (language === "java") {
      const fileName = `Main_${Date.now()}`;
      executeCode(`javac /tmp/${fileName}.java && java -cp /tmp ${fileName}`, fileName, "java");
    }
  }
}
