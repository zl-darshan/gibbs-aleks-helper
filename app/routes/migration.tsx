import React from "react";

const SAMPLE = `<def>
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

</ITEM>`;

export default function Migration() {
    const inputRef = React.useRef<HTMLTextAreaElement | null>(null);
    const outputRef = React.useRef<HTMLPreElement | null>(null);
    const [items, setItems] = React.useState<string[]>([]);

    function migrateISL(src: string) {
        if (typeof src !== "string") return "";

        return src;
    }

    return (
        <main className="container size-full">
            <h1 className="text-xl mb-2">Arch1 → Arch2 Migration Tool</h1>
            <p className="text-sm text-gray-600">Paste Architecture 1 content and press Convert.</p>

            <div className="mb-4">
                <textarea ref={inputRef} className="w-full p-2 border rounded" rows={12} />
                <div className="mt-2 flex gap-2">
                    <button onClick={() => { if (inputRef.current) inputRef.current.value = ""; }}>Clear</button>
                    <button onClick={() => { if (inputRef.current) inputRef.current.value = SAMPLE.trim(); }}>Load Sample</button>
                    <button onClick={onConvert}>Convert</button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h2 className="font-semibold">Detected Items</h2>
                    <ul className="mt-2">
                        {items.length === 0 && <li className="text-sm text-gray-500">(no items found)</li>}
                        {items.map((it, idx) => <li key={idx}>{idx + 1}. {it}</li>)}
                    </ul>
                </div>
                <div>
                    <h2 className="font-semibold">Converted Output</h2>
                    <pre ref={outputRef} className="mt-2 p-2 bg-gray-900 text-white rounded h-72 overflow-auto"></pre>
                </div>
            </div>
        </main>
    );
}

