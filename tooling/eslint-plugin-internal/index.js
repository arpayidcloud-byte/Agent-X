module.exports = {
  rules: {
    "no-secret-prefix-logging": {
      meta: {
        type: "problem",
        docs: {
          description: "Flag string literals matching AGENTX_SECRET_ prefix in log calls",
          category: "Security"
        },
        schema: []
      },
      create(context) {
        const logMethods = ["log", "info", "warn", "error", "debug", "trace"];
        return {
          CallExpression(node) {
            // Check if call is console.xxx or logger.xxx
            const isConsoleLog =
              node.callee.type === "MemberExpression" &&
              node.callee.object.type === "Identifier" &&
              node.callee.object.name === "console" &&
              node.callee.property.type === "Identifier" &&
              logMethods.includes(node.callee.property.name);

            const isLoggerLog =
              node.callee.type === "MemberExpression" &&
              node.callee.object.type === "Identifier" &&
              node.callee.object.name.toLowerCase().includes("logger") &&
              node.callee.property.type === "Identifier" &&
              logMethods.includes(node.callee.property.name);

            if (isConsoleLog || isLoggerLog) {
              node.arguments.forEach((arg) => {
                if (arg.type === "Literal" && typeof arg.value === "string" && arg.value.includes("AGENTX_SECRET_")) {
                  context.report({
                    node: arg,
                    message: "Avoid logging string literals containing AGENTX_SECRET_ prefix."
                  });
                }
              });
            }
          }
        };
      }
    },
    "no-credential-logging": {
      meta: {
        type: "problem",
        docs: {
          description: "Flag any log statement containing variable from CredentialResolver.resolve()",
          category: "Security"
        },
        schema: []
      },
      create(context) {
        const logMethods = ["log", "info", "warn", "error", "debug", "trace"];
        // Track variables initialized from CredentialResolver.resolve() or resolver.resolve()
        const credentialVariables = new Set();

        return {
          VariableDeclarator(node) {
            if (
              node.init &&
              node.init.type === "CallExpression" &&
              node.init.callee.type === "MemberExpression" &&
              node.init.callee.property.type === "Identifier" &&
              node.init.callee.property.name === "resolve"
            ) {
              const obj = node.init.callee.object;
              // Check if object is CredentialResolver or a resolver variable
              const isResolver =
                (obj.type === "Identifier" && obj.name.toLowerCase().includes("resolver")) ||
                (obj.type === "MemberExpression" && obj.property.name === "resolver");

              if (isResolver && node.id.type === "Identifier") {
                credentialVariables.add(node.id.name);
              }
            }
          },
          CallExpression(node) {
            const isConsoleLog =
              node.callee.type === "MemberExpression" &&
              node.callee.object.type === "Identifier" &&
              node.callee.object.name === "console" &&
              node.callee.property.type === "Identifier" &&
              logMethods.includes(node.callee.property.name);

            const isLoggerLog =
              node.callee.type === "MemberExpression" &&
              node.callee.object.type === "Identifier" &&
              node.callee.object.name.toLowerCase().includes("logger") &&
              node.callee.property.type === "Identifier" &&
              logMethods.includes(node.callee.property.name);

            if (isConsoleLog || isLoggerLog) {
              node.arguments.forEach((arg) => {
                if (arg.type === "Identifier" && credentialVariables.has(arg.name)) {
                  context.report({
                    node: arg,
                    message: "Do not log variables returned from CredentialResolver.resolve()."
                  });
                }
              });
            }
          }
        };
      }
    },
    "no-vendor-sdk-import": {
      meta: {
        type: "problem",
        docs: {
          description: "Flag any import of vendor SDK outside packages/provider-sdk/providers/*",
          category: "Security"
        },
        schema: []
      },
      create(context) {
        const filePath = context.getFilename();
        const isProviderSdkDir = filePath.includes("provider-sdk/providers/") || filePath.includes("provider-sdk/src/providers/") || filePath.includes("provider-sdk/dist/");
        
        const vendorLibraries = ["@google/generative-ai", "@anthropic-ai/sdk", "openai"];

        return {
          ImportDeclaration(node) {
            if (!isProviderSdkDir) {
              const sourceVal = node.source.value;
              if (vendorLibraries.some((lib) => sourceVal === lib || sourceVal.startsWith(lib + "/"))) {
                context.report({
                  node,
                  message: `Vendor SDK '${sourceVal}' cannot be imported outside packages/provider-sdk/providers/*`
                });
              }
            }
          },
          CallExpression(node) {
            if (!isProviderSdkDir) {
              if (
                node.callee.type === "Identifier" &&
                node.callee.name === "require" &&
                node.arguments.length > 0 &&
                node.arguments[0].type === "Literal"
              ) {
                const sourceVal = node.arguments[0].value;
                if (vendorLibraries.some((lib) => sourceVal === lib || sourceVal.startsWith(lib + "/"))) {
                  context.report({
                    node,
                    message: `Vendor SDK '${sourceVal}' cannot be imported outside packages/provider-sdk/providers/*`
                  });
                }
              }
            }
          }
        };
      }
    }
  }
};
