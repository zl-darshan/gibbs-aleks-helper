import React from "react";

const getFilteredDefBlock = (src: string) => {
  return src.replace(
    /\n(?: |	)*<include module=(layoutFiged|layoutTabed|layoutAnsed|userf|userfLayout|userfJS)>.*$/gm,
    ''
  ).replace(/\n[ \t]*&\( *@userfJS\.initJSUse.*$/gm, '');
;

  let filterdDefBlock = '';
  const lines = src.split('\n');

    for (let line of lines) {
      line = line.trimEnd();
      if (line.includes('layoutFiged') ||
        line.includes('layoutAnsed') ||
        line.includes('layoutTabed') ||
        line.includes('userf')
      ) continue;
      filterdDefBlock += `
      ${line}`;
    }
}

const getTrunkModule = (src: string, maintainIndentation = false) => {

  let formatedSrc = '';
  if (!maintainIndentation) {
    // Remove leading indentation from each line
    const lines = src.split('\n');

    for (let line of lines) {
      line = line.trimEnd();
      if (line.includes('min_plugin') ||
        line.includes('best_plugin') ||
        line.includes('layoutTabed') ||
        line.includes('layoutTabedJS') ||
        line.includes('layoutFiged') ||
        line.includes('layoutFigedJS') ||
        line.includes('layoutAnsed') ||
        line.includes('layoutAnsedJS')
      ) continue;
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
  // let editorType = '';

  const convertedCodeRef = React.useRef('');
  const inputRef = React.useRef<HTMLTextAreaElement | null>(null);
  const outputRef = React.useRef<HTMLPreElement | null>(null);
  const [items, setItems] = React.useState<string[]>([]);
  const [editorType, setEditorType] = React.useState<string>("");


  function detectEditor(src: string) {
    if (!src) return "";

    let detectedEditorType = '';
    // TODO: Need to revisit this if we have more editors in future
    switch (true) {
      case /<var\s+name=\.layoutTabed\.table/i.test(src):
      case /\blayoutTabed\b/i.test(src):
      case /\btabed\b/i.test(src):
        detectedEditorType = "tabed";
        break;
      case /\%FIGED\(|\blayoutFiged\b|figed_/i.test(src):
        detectedEditorType = "figed";
        break;
      case /\blayoutAnsed\b|\bansed\b/i.test(src):
        detectedEditorType = "ansed";
        break;
    }

    setEditorType(detectedEditorType);
    return detectedEditorType;
  }

  function getBlockBody(tag: string, s: string) {
    if (!s) return undefined;
    const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
    const matches = s.match(re);
    return matches ? matches[1] : undefined;
  }

  function getEditor(stepId = "I1", stepEditorType: string) {
    switch (stepEditorType) {
      case "tabed":
        return `
        <var name=${stepEditorType}_editor_${stepId} value=@.toolLayout.createTool('${stepEditorType}','${stepEditorType}_${stepId}','editor',#{
          recall: text(DEFAULT)
        });>
        `;
      case "figed":
        return `
        <var name=${stepEditorType}_editor_${stepId} value=@.toolLayout.createTool('${stepEditorType}','${stepEditorType}_${stepId}','editor',#{
          recall: text(DEFAULT)
        });>
        `;
      case "ansed":
      default:
        return `
        <var name=${stepEditorType}_editor_${stepId} value=@.toolLayout.createTool('${stepEditorType}','${stepEditorType}_${stepId}','editor',#{
          recall: text(DEFAULT)
        });>
        `;
    }
  }

  function getStatementModuleOfStep(stepId = "I1", stepEditorType = editorType) {
    return `
      <!-- *************************************** ${stepId} *************************************** -->
      <function name=StatementModule_${stepId} list={modeRequested}>  
        ${getEditor(stepId, stepEditorType)}
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

  function getAnswerProcessingFn(id: string, stepEditorType: string) {
    return `  <!-- *************************************** Answer processing of ${id} *************************************** -->
  <function name=anspro_${stepEditorType}_${id} list={studentAnswer,teacherAnswer}>
    <evaluation rule=arith student="@studentAnswer;" teacher="@teacherAnswer;" >
    <feedback>
    </feedback>
  </function>`;
  }

  function migrateISL(src: string, explicitEditorType = "") {
    if (typeof src !== "string") return "";

    const copySrc = src;

    const preQuestionOfV1Idx = copySrc.indexOf("<QUESTION");
    const preQuestionOfV1 = preQuestionOfV1Idx >= 0 ? copySrc.slice(0, copySrc.indexOf("<QUESTION")) : copySrc;

    const filterdDefBlock = getFilteredDefBlock(preQuestionOfV1);

    const questionBodyV1 = getBlockBody("QUESTION", copySrc) || "";

    const trunkModule = getTrunkModule(questionBodyV1);

    const statementSteps = getStatementSteps();

    console.log({editorType, explicitEditorType}, explicitEditorType ?? editorType);

    const algoSteps = [{
      type: "STEP",
      id: "I1",
      editorType: explicitEditorType ?? editorType, // TODO: Need to revisit this if we have more editors in future
      statmentModule: getStatementModuleOfStep("I1", explicitEditorType ?? editorType),
      ansproModule: getAnsproModuleOfStep("I1", explicitEditorType ?? editorType), // TODO: Need to revisit this if we have more editors in future
      htmlTeacherModule: getStatementModuleMain(),
      answerProcessingFn: getAnswerProcessingFn("I1", explicitEditorType ?? editorType),
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
    const ansproProcessingFnReturnValue = algoSteps.map(s => s.answerProcessingFn).join(', ');

    const questionBlock = `<QUESTION>${trunkModule}\n\n${statementSteps}\n\n${statementModule}\n\n${resolutionSteps}\n\n${resolutionModule}\n\n${ansproModule}\n\n${teacherModule}\n\n${htmlTeacherModule}</QUESTION>\n\n${ansproProcessingFnReturnValue}\n</ITEM>`;

    return `${filterdDefBlock}\n\n${questionBlock}\n`;
  }

  function onUpdateEditorType(inputEditorType: string) {
    setEditorType(inputEditorType);
    setTimeout(() => onConvert({ explicitEditorType: inputEditorType }), 0);
  }

  function onConvert({shouldDetectEditor = false, explicitEditorType = ''}) {
    
    const inputSrc = inputRef.current?.value || "";
    if (!inputSrc) {
      setEditorType('')
      return alert('Please paste Architecture 1 ISL code');
    }

    if (shouldDetectEditor) 
      explicitEditorType = detectEditor(inputSrc);

    console.log({editorType});
    if (explicitEditorType) setItems([explicitEditorType]);
    else setItems([editorType]);

    const converted = migrateISL(inputSrc, explicitEditorType);
    convertedCodeRef.current = converted;
    if (outputRef.current) outputRef.current.textContent = converted;
  }

  async function copyToClipBoard() {
    if (!convertedCodeRef.current) return;
    await navigator.clipboard.writeText(convertedCodeRef.current);
    alert('Copied to clipboard');
    console.log('Copied to clipboard');
  }

  const showOutput = items.length !== 0;

  console.log({editorType})

  return (
    <main className="container size-full">
      <div className="flex gap-2 items-center">
        <h1 className="text-xl">Arch1 → Arch2 Migration Tool</h1>
        <p className="text-sm text-gray-600">(Paste Architecture 1 content and press Convert.)</p>
      </div>

      <div className="mb-4 flex gap-2">
        <div className="flex flex-col gap-16">
          <div className="mt-2 flex gap-2 flex-wrap content-start justify-center">
            <button className="max-h-max" onClick={() => { if (inputRef.current) inputRef.current.value = ""; }}>Clear</button>
            <button className="max-h-max" onClick={() => { if (inputRef.current) inputRef.current.value = SAMPLE.trim(); }}>Load Sample</button>
            <button className="max-h-max" onClick={() => onConvert({shouldDetectEditor: true})}>Convert</button>
          </div>
          <div className="text-center">
            <h2 className="font-semibold">Detected Items</h2>
            <ul className="m-4">
              {items.length === 0 && <li className="text-sm text-gray-500">(no items found)</li>}
              {items.map((it, idx) => <li key={idx}><b>{editorType}</b></li>)} { /* // TODO: Need to revisit this if we have more editors in future */ }
            </ul>
          </div>
        </div>
        <textarea ref={inputRef} className="w-full p-2 border rounded" rows={12} />
      </div>

      <div className="flex gap-4 w-full">
        { showOutput &&
          <div className="min-w-[12%] text-center">
            <h2 className="font-semibold">Change EditorType :</h2>
            <div className="flex flex-wrap gap-4 content-center flex-col">
              <label><input name="editorType" value="ansed" checked={editorType == "ansed"} type="radio" onClick={
                e => onUpdateEditorType('ansed')
              }/>Ansed</label>
              <label><input name="editorType" value="tabed" checked={editorType == "tabed"} type="radio" onClick={
                e => onUpdateEditorType('tabed')
              }/>Tabed</label>
              <label><input name="figed" value="figed" checked={editorType == "figed"} type="radio" onClick={
                e => onUpdateEditorType('figed')
              }/>Figed</label>
            </div>
          </div>
        }
        <div className="w-[86%] flex-grow">
          <div className="relative">
          {
            showOutput &&
            <button className="absolute top-2 right-2 !p-2 !mr-4" onClick={copyToClipBoard} aria-label="Copy output to clipboard">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
          }
            <pre ref={outputRef} className={!showOutput ? 'w-0' : 'p-2 bg-gray-900 text-white rounded h-90 overflow-auto'}></pre>
          </div>
        </div>
      </div>
    </main>
  );
}

