# parse_python.py
import ast
import json
import sys

def parse_python_code(code):
    try:
        tree = ast.parse(code)
        return ast.dump(tree)
    except SyntaxError as e:
        return json.dumps({"error": f"Error parsing Python code: {str(e)}"})
    

if __name__ == "__main__":
    # Read code from stdin
    code = sys.argv[1]  # Read code passed as an argument
    parsed_data = parse_python_code(code)
    print(json.dumps(parsed_data))  # Output as JSON
