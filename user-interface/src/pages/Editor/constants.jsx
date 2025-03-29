export const LANGUAGE_VERSIONS = {
  javascript: "18.15.0",
  c:"10.2.0",
  cpp: "10.2.0",
  python: "3.10.0",
  java: "15.0.2",
  nasm64:"2.15.5"
};

export const CODE_SNIPPETS = {
  javascript: `\nfunction greet(name) {\n\tconsole.log("Hello, " + name + "!");\n}\n\ngreet("Alex");\n`,
  cpp: `#include<iostream> \nusing namespace std;\n\nint main(){\n\n\treturn 0;\n}\n`,
  python: `\ndef greet(name):\n\tprint("Hello, " + name + "!")\n\ngreet("Alex")\n`,
  java: `\npublic class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}\n`,
  nasm: `section .data\n\tmsg db "Hello, World!",0xa\n\nsection .text\n\tglobal _start\n\n_start:\n\tmov rax, 1\n\tmov rdi, 1\n\tmov rsi, msg\n\tmov rdx, 14\n\tsyscall\n\n\tmov rax, 60\n\txor rdi, rdi\n\tsyscall`
};


