import{w as N,R as m,p as t}from"./chunk-PVWAREVJ-BX-UlHOX.js";const I=(d,r=!1)=>{let s="";if(r)s=d;else{const u=d.split(`
`);for(let i of u)i=i.trimEnd(),i!==""&&(s+=`
        ${i}`)}return`<function name=TrunkModule list={}>
    <def module=".">
        <var name=iBeg value="@userf.indent_begin();">
        <var name=iEnd value="@userf.indent_end();">

        ${s}
    </def>
</function>`},R=()=>`<function name=StatementSteps list={}>
    <return value={"I1"}>
</function>`,S=`<def>
</def>

<description>
  <label name=level value={}>
  <label name=curriculum value={}>
  <label name=under value={}>
  <label name=thesaurus value={}>
</description>

<ITEM TITLE="@Title">
  <INSTANCE>
  </INSTANCE>
  <REQUIREMENT>
  </REQUIREMENT>

  <SEQUENCE INDEX=history>
  </SEQUENCE>
  <REQUIREMENT>
  </REQUIREMENT>

  <QUESTION>
    <function name=TrunkModule list={}>
      <def module=".">
      </def>
    </function>

    <function name=StatementSteps list={}>
      <return value={"I1"}>
    </function>

    <function name=StatementModule list={}>
      <def module=".">

        <function name=StatementModule_Main list={modeRequested}>
          <if cond=("@modeRequested" == "static")>
            <TEXT REF=STATEMENT>%Question;</TEXT>
          <else cond=("@modeRequested" == "resolution")>
            <TEXT REF=STATEMENT>%Question;</TEXT>
          <else cond=("@modeRequested" == "pdf")>
            <TEXT REF=STATEMENT><span style="page-break-inside: avoid;">%Question;</span></TEXT>
          </if>
          <return value="STATEMENT">
        </function>

        <function name=StatementModule_I1 list={modeRequested}>
          <TEXT REF=INTERACTION></TEXT>
          <return value="INTERACTION">
        </function>

      </def>
    </function>


    <function name=ResolutionSteps list={}>
      <return value={}>
    </function>

    <function name=ResolutionModule list={partsRequested}>
      <def module=".">
        <function name=ResolutionModule_Main list={modeRequested}>
          <TEXT REF=RESOLUTION>%Explanation;</TEXT>
          <return value="RESOLUTION">
        </function>
      </def>
    </function>


    <function name=AnsproModule list={}>
      <return value=#{I1:{""}}>
    </function>

    <function name=TeacherModule list={partRequested,mode}>
      &(teacherAnswerHash=#{};;);
      <var name=teacherAnswerHash[""] value="">
      <return value=@teacherAnswerHash>
    </function>

    <function name=HtmlTeacherModule list={partRequested}>
      <unvar name=teacherAnswerHTML>
      <var name=teacherAnswerHTML value="">
      <return value="@teacherAnswerHTML">
    </function>

  </QUESTION>

</ITEM>`,M=N(function(){let r="ansed";const s=m.useRef(null),u=m.useRef(null),[i,f]=m.useState([]);function T(e){if(!e)return null;switch(!0){case/<var\s+name=\.layoutTabed\.table/i.test(e):case/\blayoutTabed\b/i.test(e):case/\btabed\b/i.test(e):r="tabed";break;case/\%FIGED\(|\blayoutFiged\b|figed_/i.test(e):r="figed";break;case/\blayoutAnsed\b|\bansed\b/i.test(e):r="ansed";break}}function E(e,n){if(!n)return;const a=new RegExp(`<${e}[^>]*>([\\s\\S]*?)<\\/${e}>`,"i"),o=n.match(a);return o?o[1]:void 0}function h(e){if(typeof e!="string")return"";const n=e,o=n.indexOf("<QUESTION")>=0?n.slice(0,n.indexOf("<QUESTION")):n;console.log("Def block:",o);const l=E("QUESTION",n)||"";console.log("Question body V1:",l),n.search(/<\/QUESTION>/i);const c=I(l),x=R();return`${o}

${c}

${x}`}function p(e){const n=[],a=/<ITEM\b([\s\S]*?)>([\s\S]*?)<\/ITEM>/gi;let o;for(;o=a.exec(e);){const l=o[1],c=/TITLE\s*=\s*"([^"]*)"/i.exec(l);n.push(c?c[1]:"Untitled")}return n}function v(){var a;const e=((a=s.current)==null?void 0:a.value)||"";if(!e)return alert("Please paste Architecture 1 ISL code");T(e),console.log("Detected editor type:",r);const n=h(e);u.current&&(u.current.textContent=n),f(p(e))}return t.jsxs("main",{className:"container size-full",children:[t.jsx("h1",{className:"text-xl mb-2",children:"Arch1 → Arch2 Migration Tool"}),t.jsx("p",{className:"text-sm text-gray-600",children:"Paste Architecture 1 content and press Convert."}),t.jsxs("div",{className:"mb-4",children:[t.jsx("textarea",{ref:s,className:"w-full p-2 border rounded",rows:12}),t.jsxs("div",{className:"mt-2 flex gap-2",children:[t.jsx("button",{onClick:()=>{s.current&&(s.current.value="")},children:"Clear"}),t.jsx("button",{onClick:()=>{s.current&&(s.current.value=S.trim())},children:"Load Sample"}),t.jsx("button",{onClick:v,children:"Convert"})]})]}),t.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[t.jsxs("div",{children:[t.jsx("h2",{className:"font-semibold",children:"Detected Items"}),t.jsxs("ul",{className:"mt-2",children:[i.length===0&&t.jsx("li",{className:"text-sm text-gray-500",children:"(no items found)"}),i.map((e,n)=>t.jsxs("li",{children:[n+1,". ",e]},n))]})]}),t.jsxs("div",{children:[t.jsx("h2",{className:"font-semibold",children:"Converted Output"}),t.jsx("pre",{ref:u,className:"mt-2 p-2 bg-gray-900 text-white rounded h-72 overflow-auto"})]})]})]})});export{M as default};
