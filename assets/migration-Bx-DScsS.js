import{w as o,R as n,p as e}from"./chunk-PVWAREVJ-BX-UlHOX.js";const r=`<def>
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

</ITEM>`,m=o(function(){const t=n.useRef(null),l=n.useRef(null),[s,c]=n.useState([]);return e.jsxs("main",{className:"container size-full",children:[e.jsx("h1",{className:"text-xl mb-2",children:"Arch1 → Arch2 Migration Tool"}),e.jsx("p",{className:"text-sm text-gray-600",children:"Paste Architecture 1 content and press Convert."}),e.jsxs("div",{className:"mb-4",children:[e.jsx("textarea",{ref:t,className:"w-full p-2 border rounded",rows:12}),e.jsxs("div",{className:"mt-2 flex gap-2",children:[e.jsx("button",{onClick:()=>{t.current&&(t.current.value="")},children:"Clear"}),e.jsx("button",{onClick:()=>{t.current&&(t.current.value=r.trim())},children:"Load Sample"}),e.jsx("button",{onClick:onConvert,children:"Convert"})]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"font-semibold",children:"Detected Items"}),e.jsxs("ul",{className:"mt-2",children:[s.length===0&&e.jsx("li",{className:"text-sm text-gray-500",children:"(no items found)"}),s.map((u,a)=>e.jsxs("li",{children:[a+1,". ",u]},a))]})]}),e.jsxs("div",{children:[e.jsx("h2",{className:"font-semibold",children:"Converted Output"}),e.jsx("pre",{ref:l,className:"mt-2 p-2 bg-gray-900 text-white rounded h-72 overflow-auto"})]})]})]})});export{m as default};
