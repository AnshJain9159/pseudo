type OutputCellProps = {
    output: string;
  };
  
  const OutputCell: React.FC<OutputCellProps> = ({ output }) => {
    return (
      <pre className="bg-gray-800 p-4 rounded-md text-gray-100 overflow-x-auto">
        {output}
      </pre>
    );
  };
  
  export default OutputCell;
  