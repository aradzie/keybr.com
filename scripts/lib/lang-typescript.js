"use strict";

const ts = require("typescript");
const { moduleName } = require("./util.js");

function findTypescriptDeps(fileName, source) {
  const modules = new Set();
  walkNode(
    ts.createSourceFile(
      fileName,
      source,
      ts.ScriptTarget.Latest,
      /* setParentNodes= */ false,
    ),
  );
  return modules;

  function walkNode(node) {
    switch (node.kind) {
      case ts.SyntaxKind.CallExpression:
        {
          const { expression, arguments: args } = node;
          if (
            expression.kind === ts.SyntaxKind.Identifier &&
            expression.text === "require" &&
            args.length === 1 &&
            args[0].kind === ts.SyntaxKind.StringLiteral
          ) {
            const { text } = args[0];
            if (!(text.startsWith("./") || text.startsWith("../"))) {
              modules.add(moduleName(text));
            }
          }
        }
        break;
      case ts.SyntaxKind.ImportDeclaration:
        {
          const { moduleSpecifier } = node;
          if (moduleSpecifier.kind === ts.SyntaxKind.StringLiteral) {
            const { text } = moduleSpecifier;
            if (!(text.startsWith("./") || text.startsWith("../"))) {
              modules.add(moduleName(text));
            }
          }
        }
        break;
      case ts.SyntaxKind.ExportDeclaration:
        {
          const { moduleSpecifier } = node;
          if (
            moduleSpecifier != null &&
            moduleSpecifier.kind === ts.SyntaxKind.StringLiteral
          ) {
            const { text } = moduleSpecifier;
            if (!(text.startsWith("./") || text.startsWith("../"))) {
              modules.add(moduleName(text));
            }
          }
        }
        break;
    }
    ts.forEachChild(node, walkNode);
  }
}

module.exports.findTypescriptDeps = findTypescriptDeps;
