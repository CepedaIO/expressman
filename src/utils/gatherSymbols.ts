import {readFileSync} from "fs";

interface Symbols {
  arg?: string;
  return?: string;
}

interface FileSymbols {
  filePath: string;
  methods: Map<string, Symbols>
}

const symbolRegex = /\s(?<method>\w+)[\s\r\n]*\((?<args>[^{]+)\)[\s\t\r\n]*:[\s\t\r\n]*(?<returnSymbol>.+)[\s\t\r\n]*{/gm;

export function getArg(args:string): string | undefined {
  const parts = args.split(':');
  return parts.length > 1 ? parts[1].trim() : undefined
}

export function getReturn(returnStr: string): string | undefined {
  if(returnStr.includes('Promise')) {
    const matches = /Promise<(?<innerSymbol>\w+)>/gm.exec(returnStr)!;
    return matches.groups!["innerSymbol"];
  }
  
  return returnStr.trim();
}

export default function gatherSymbols(filePath:string): FileSymbols {
  const file = readFileSync(filePath, 'utf-8');
  const result = {
    filePath,
    methods: new Map<string, Symbols>()
  };
  let match;
  
  do {
    match = symbolRegex.exec(file);
    if(match) {
      const { method, args, returnSymbol } = match.groups as any;
      result.methods.set(method, {
        arg: getArg(args),
        return: getReturn(returnSymbol)
      });
    }
  } while (match);
 
  return result;
}