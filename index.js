#!/usr/bin/env node

// console.log(process.argv);
const note = process.argv[2];
const newNote = {
  id: new Date(),
  note,
};

console.log("your new note", newNote);
