# parse_c.py

from pycparser import c_parser, c_ast
import json
import sys
import traceback

def get_type_name(type_node):
    """
    Recursively extracts the type name from the type node.
    Handles different type node classes such as TypeDecl, IdentifierType, PtrDecl, etc.
    """
    if isinstance(type_node, c_ast.TypeDecl):
        return get_type_name(type_node.type)
    elif isinstance(type_node, c_ast.IdentifierType):
        return ' '.join(type_node.names)
    elif isinstance(type_node, c_ast.PtrDecl):
        return get_type_name(type_node.type) + ' *'
    elif isinstance(type_node, c_ast.ArrayDecl):
        return get_type_name(type_node.type) + '[]'
    elif isinstance(type_node, c_ast.FuncDecl):
        return 'function returning ' + get_type_name(type_node.type)
    else:
        return str(type_node)

def parse_c_code(code):
    try:
        # Remove preprocessor directives
        code_without_includes = '\n'.join(
            line for line in code.splitlines()
            if not line.strip().startswith('#')
        )

        # Initialize the parser
        parser = c_parser.CParser()

        # Parse the code
        ast = parser.parse(code_without_includes)

        # Convert AST to a dictionary representation
        ast_dict = {
            "type": "translation_unit",
            "functions": [],
            "declarations": []
        }

        # Extract function definitions and declarations
        for node in ast.ext:
            node_type = node.__class__.__name__
            if node_type == 'FuncDef':
                function_info = {
                    "type": "function",
                    "name": node.decl.name,
                    "return_type": get_type_name(node.decl.type),
                    "parameters": []
                }
                if node.decl.type.args:
                    for param in node.decl.type.args.params:
                        param_type = get_type_name(param.type)
                        param_name = param.name if param.name else ''
                        function_info["parameters"].append({
                            "type": param_type,
                            "name": param_name
                        })
                ast_dict["functions"].append(function_info)
            elif node_type == 'Decl':
                var_type = get_type_name(node.type)
                decl_info = {
                    "type": "declaration",
                    "name": node.name,
                    "var_type": var_type
                }
                ast_dict["declarations"].append(decl_info)

        return json.dumps(ast_dict)

    except Exception as e:
        error_info = {
            "error": str(e),
            "traceback": traceback.format_exc(),
            "details": "Failed to parse C code"
        }
        return json.dumps(error_info)

if __name__ == "__main__":
    try:
        # Read code from stdin
        code = sys.stdin.read()
        if not code.strip():
            print(json.dumps({"error": "Empty code provided"}))
            sys.exit(1)

        # Parse and output the results
        result = parse_c_code(code)
        print(result)

    except Exception as e:
        error_info = {
            "error": str(e),
            "traceback": traceback.format_exc(),
            "details": "Failed to process input"
        }
        print(json.dumps(error_info))
        sys.exit(1)
