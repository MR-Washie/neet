const fs = require('fs');
const s = fs.readFileSync('src/app/(studentsPages)/tests/page.tsx','utf8').split('\n');
let stack=[];
for(let i=0;i<s.length;i++){
  const line=s[i];
  let idx=0;
  while(true){
    const open=line.indexOf('<div',idx);
    const close=line.indexOf('</div>',idx);
    if(open===-1 && close===-1) break;
    if(open!==-1 && (close===-1 || open<close)){
      stack.push({line:i+1, text:line.trim()});
      idx=open+4;
    } else {
      if(stack.length) stack.pop();
      idx=close+6;
    }
  }
}
if(stack.length) console.log('unmatched top at line', stack[stack.length-1]); else console.log('all matched');
