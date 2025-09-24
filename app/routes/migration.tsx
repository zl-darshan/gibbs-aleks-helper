import React from "react";

const getDefBlock = (s: string) => {
  return `<def>
  ${s}
</def>`;
}

const getTrunkModule = (src: string, maintainIndentation = false) => {

  let formatedSrc = '';
  if (!maintainIndentation) {
    // Remove leading indentation from each line
    const lines = src.split('\n');


    for (let line of lines) {
      line = line.trimEnd();
      if (line.includes('min_plugin') || line.includes('best_plugin')) continue;
      formatedSrc += `
      ${line}`;
    }
  } else {
    formatedSrc = src;
  }

  return `
  <function name=TrunkModule list={}>
    <def module=".">
      ${formatedSrc}
    </def>
  </function>`;
}

const getStatementSteps = () => {
  return `
  <function name=StatementSteps list={}>
    <return value={"I1"}>
  </function>`;
}

const getStatementModuleMain = (modeFlags = { includeStatic: false, includeResolution: false, includePdf: false }) => {

  return `
      <function name=StatementModule_Main list={modeRequested}>
        <if cond=("@modeRequested" == "static")>
          <TEXT REF=STATEMENT>%Question;</TEXT>
        <else cond=("@modeRequested" == "resolution")>  
          <TEXT REF=STATEMENT>%Question;</TEXT>
        <else cond=("@modeRequested" == "pdf")>
          <TEXT REF=STATEMENT><span style="page-break-inside: avoid;">%Question;</span></TEXT>
        </if>
        <return value="STATEMENT">
      </function>`;
}

const getStatementModule = (s: string) => {
  return `
  <function name=StatementModule list={}>
    <def module=".">
        ${s}
    </def>
  </function>`;
}

const getQuestionBlock = (s: string) => {
  return `<QUESTION>
    ${s}
</QUESTION>`;
}



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
  let editorType = 'ansed';

  const convertedCodeRef = React.useRef('');
  const inputRef = React.useRef<HTMLTextAreaElement | null>(null);
  const outputRef = React.useRef<HTMLPreElement | null>(null);
  const [items, setItems] = React.useState<string[]>([]);


  function detectEditor(src: string) {
    if (!src) return null;

    // TODO: Need to revisit this if we have more editors in future
    switch (true) {
      case /<var\s+name=\.layoutTabed\.table/i.test(src):
      case /\blayoutTabed\b/i.test(src):
      case /\btabed\b/i.test(src):
        editorType = "tabed";
        break;
      case /\%FIGED\(|\blayoutFiged\b|figed_/i.test(src):
        editorType = "figed";
        break;
      case /\blayoutAnsed\b|\bansed\b/i.test(src):
        editorType = "ansed";
        break;
    }
  }

  function getBlockBody(tag: string, s: string) {
    if (!s) return undefined;
    const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
    const matches = s.match(re);
    return matches ? matches[1] : undefined;
  }

  function getEditor(stepId = "I1") {
    switch (editorType) {
      case "tabed":
        return `
                <var name=${editorType}_editor_${stepId} value=@.toolLayout.createTool('${editorType}','${editorType}_${stepId}','editor',#{

                });>
                `;
      case "figed":
        return `
                <var name=${editorType}_editor_${stepId} value=@.toolLayout.createTool('${editorType}','${editorType}_${stepId}','editor',#{

                });>
                `;
      case "ansed":
      default:
        return `
                <var name=${editorType}_editor_${stepId} value=@.toolLayout.createTool('${editorType}','${editorType}_${stepId}','editor',#{

                });>
                `;
    }
  }

  function getStatementModuleOfStep(stepId = "I1", stepEditorType = editorType) {
    return `
      <!-- *************************************** ${stepId} *************************************** -->
      <function name=StatementModule_${stepId} list={modeRequested}>  
        ${getEditor(stepId)}
        <TEXT REF=INTERACTION>@${stepEditorType}_editor_${stepId};</TEXT>
        <return value="INTERACTION">
      </function>`;
  }

  function getResolutionModuleSteps() {
    return `  <function name=ResolutionSteps list={}>
    <return value={}>
  </function>`;
  }

  function getResolutionModuleMain({ includealternate = false } = {}) {
    const resolutionText = includealternate ? `  <if cond=("@modeRequested" == "static")>
          <TEXT REF=RESOLUTION>%Explanation;</TEXT>
        <else cond=("@modeRequested" == "alternate")>
          <TEXT REF=RESOLUTION>%Alt;</TEXT>
        </if>`
      :`<TEXT REF=RESOLUTION>%Explanation;</TEXT>`
    return `<function name=ResolutionModule_Main list={modeRequested}>
      ${resolutionText}
        <return value="RESOLUTION">
      </function>
  `;
  }

  function getResolutionModule(resolutionModuleMainSrc: string) {
    return `  <function name=ResolutionModule list={partsRequested}>
    <def module=".">
      ${resolutionModuleMainSrc}
    </def>
  </function>`;
  }

  function getAnsproModuleOfStep(id: string, stepEditorType: string) {
    return `${id}:{"${stepEditorType}_${id}"}`;
  }

  function getAnsproModule(returnValue: string) {
    return `  <function name=AnsproModule list={}>
    <return value=#{${returnValue}}>
  </function>`;
  }

  function getTeacherModule(steps: { type: string; id: string; editorType: string; statmentModule: string; ansproModule: string; htmlTeacherModule: string; }[]) {
    return `  <function name=TeacherModule list={partRequested,mode}>
    &(teacherAnswerHash=#{};;);
    ${steps.map(s => `<var name=teacherAnswerHash["${s.editorType}_${s.id}"] value="@teacher">`).join('\n      ')}
    <return value=@teacherAnswerHash>
  </function>`;
  }

  function getHtmlTeacherModule() {
    return `  <function name=HtmlTeacherModule list={partRequested}>
    <unvar name=teacherAnswerHTML>
    <var name=teacherAnswerHTML value="&(text(TEACHER))">
    <return value="@teacherAnswerHTML">
  </function>\n`;
  }

  function escapeForXml(s: any) {
    if (s == null) return "";
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function pruneTopDef(preQuestion: string) {
    if (!preQuestion) return "";
    const defMatch = preQuestion.match(/<def[^>]*>([\s\S]*?)<\/def>/i);
    if (!defMatch) return preQuestion;
    const defBody = defMatch[1];
    const lines = defBody.split(/\r?\n/);
    const kept = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      kept.push(line);
    }
    const newDef = getDefBlock(kept.join('\n'));
    const result = preQuestion.replace(defMatch[0], newDef);
    return result;
  }

  function migrateISL(src: string) {
    if (typeof src !== "string") return "";

    const copySrc = src;

    const preQuestionOfV1Idx = copySrc.indexOf("<QUESTION");
    const preQuestionOfV1 = preQuestionOfV1Idx >= 0 ? copySrc.slice(0, copySrc.indexOf("<QUESTION")) : copySrc;

    console.log("Def block:", preQuestionOfV1);

    const questionBodyV1 = getBlockBody("QUESTION", copySrc) || "";

    console.log("Question body V1:", questionBodyV1);


    const questionClose = copySrc.search(/<\/QUESTION>/i);

    const trunkModule = getTrunkModule(questionBodyV1);

    const statementSteps = getStatementSteps();

    const algoSteps = [{
      type: "STEP",
      id: "I1",
      editorType, // TODO: Need to revisit this if we have more editors in future
      statmentModule: getStatementModuleOfStep(),
      ansproModule: getAnsproModuleOfStep("I1", editorType), // TODO: Need to revisit this if we have more editors in future
      htmlTeacherModule: getStatementModuleMain(),
    }];

    const statementModuleMain = getStatementModuleMain();
    const stepsStatementModules = algoSteps.map(s => s.statmentModule).join('\n');
    const statementModule = getStatementModule(`${statementModuleMain}\n${stepsStatementModules}`);

    const resolutionSteps = getResolutionModuleSteps();

    const resolutionModuleMain = getResolutionModuleMain({includealternate: true});
    const resolutionModule = getResolutionModule(resolutionModuleMain);
    

    const ansproModuleReturnValue = algoSteps.map(s => s.ansproModule).join(', ');
    const ansproModule = getAnsproModule(ansproModuleReturnValue);

    const teacherModule = getTeacherModule(algoSteps);

    const htmlTeacherModule = getHtmlTeacherModule();
    // const stepsHtmlTeacherModules = algoSteps.map(s => s.htmlTeacherModule).join('\n');


    // = getStatementModule(algoSteps.map(s => s.statmentModule).join('\n'));

    const questionBlock = `<QUESTION>${trunkModule}\n\n${statementSteps}\n\n${statementModule}\n\n${resolutionSteps}\n\n${resolutionModule}\n\n${ansproModule}\n\n${teacherModule}\n\n${htmlTeacherModule}</QUESTION>\n</ITEM>`;

    return `${preQuestionOfV1}\n\n${questionBlock}\n`;
  }

  function simpleParseItems(src: string) {
    const res: string[] = [];
    const re = /<ITEM\b([\s\S]*?)>([\s\S]*?)<\/ITEM>/gi;
    let m: RegExpExecArray | null;
    while ((m = re.exec(src))) {
      const attrs = m[1];
      const t = /TITLE\s*=\s*"([^"]*)"/i.exec(attrs);
      res.push(t ? t[1] : 'Untitled');
    }
    return res;
  }

  function onConvert() {
    const text = inputRef.current?.value || "";
    if (!text) return alert('Please paste Architecture 1 ISL code');

    detectEditor(text);
    console.log("Detected editor type:", editorType);

    setItems([editorType]);

    const converted = migrateISL(text);
    convertedCodeRef.current = converted;
    if (outputRef.current) outputRef.current.textContent = converted;
    // setItems(simpleParseItems(text));
  }

  async function copyToClipBoard() {
    if (!convertedCodeRef.current) return;
    await navigator.clipboard.writeText(convertedCodeRef.current);
    alert('Copied to clipboard');
    console.log('Copied to clipboard');
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

      <div className="flex gap-4">
        <div>
          <h2 className="font-semibold">Detected Items</h2>
          <ul className="mt-2">
            {items.length === 0 && <li className="text-sm text-gray-500">(no items found)</li>}
            {items.map((it, idx) => <li key={idx}>{idx + 1}. {it}</li>)}
          </ul>
        </div>
        <div className="flex-2">
          <h2 className="font-semibold">Converted Output</h2>
          <button onClick={copyToClipBoard}>Copy</button>
          <pre ref={outputRef} className="mt-2 p-2 bg-gray-900 text-white rounded h-72 overflow-auto"></pre>
        </div>
      </div>
    </main>
  );
}

