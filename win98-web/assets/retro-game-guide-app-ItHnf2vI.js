import{A as n,I as r}from"./main-DHIAoIJR.js";import"./xterm-BwRfFNjq.js";import"./xterm-BV-LBlTX.js";import"./zenfs-5S7w0OYW.js";const l=[{id:"intro",title:"1. 각 게임 소개",html:`
      <h3 style="margin:0 0 8px;color:#000080;border-bottom:1px solid #808080;padding-bottom:4px;">1. RETRO DESKTOP 수록 게임 소개</h3>
      <p style="margin:0 0 8px;line-height:1.5;">
        <b>RETRO DESKTOP</b>은 1990년대 컴퓨터실과 한글 Windows 98 바탕화면 환경을 그대로 복원한 공간입니다.
        기본 <b>[레트로 게임]</b> 폴더와 바탕화면에 다음 3종의 핵심 고전 게임이 배치되어 있습니다.
      </p>
      <ul style="margin:0 0 10px;padding-left:18px;line-height:1.6;">
        <li><b>한컴타자연습 97 (1997, 한글과컴퓨터)</b>: MS-DOS 원본 실행 파일(<code>_HTTD_.EXE</code>)을 WebAssembly DOSBox로 구동합니다. 자리연습, 낱말연습, 짧은글 연습, 긴글 연습과 고전 타자 게임 <b>산성비</b>, <b>침략자</b>가 수록되어 있습니다.</li>
        <li><b>한메타자교사 3.0 (1994, 한메소프트)</b>: MS-DOS 원본 실행 파일(<code>HTT.EXE</code>)을 구동합니다. 자리/낱말/단문/장문 연습과 하늘에서 떨어지는 단어를 입력해 탑을 지키는 원조 <b>베네치아</b> 타자 게임이 수록되어 있습니다.</li>
        <li><b>피카츄 배구 (1997, SACHI SOFT)</b>: 1997년 원작 물리 엔진과 사운드를 완벽히 복원한 버전으로, 1인용 컴퓨터 AI 대전(15점 내기), 2인용 한 키보드 로컬 대전, WebRTC P2P 온라인 대전을 지원합니다.</li>
      </ul>
    `},{id:"launch",title:"2. 게임 실행 방법",html:`
      <h3 style="margin:0 0 8px;color:#000080;border-bottom:1px solid #808080;padding-bottom:4px;">2. 게임 실행 방법</h3>
      <ol style="margin:0 0 10px;padding-left:18px;line-height:1.6;">
        <li><b>바탕화면 아이콘 실행</b>: 바탕화면 왼쪽에 배치된 <b>[한컴타자연습]</b>, <b>[한메타자연습]</b>, <b>[피카츄 배구]</b> 아이콘을 마우스로 <b>더블클릭</b>합니다.</li>
        <li><b>[레트로 게임] 폴더 실행</b>: 바탕화면의 <b>[레트로 게임]</b> 폴더를 더블클릭하여 연 뒤, 원하는 게임 아이콘이나 <b>[게임 가이드]</b>를 더블클릭합니다.</li>
        <li><b>시작 메뉴 실행</b>: 화면 왼쪽 아래 <b>[시작] &rarr; [프로그램] &rarr; [보조프로그램] &rarr; [게임]</b> 메뉴에서도 모든 게임을 클릭 한 번으로 실행할 수 있습니다.</li>
        <li><b>창 안쪽 포커스</b>: 게임 창이 열리면 <b>창 내부 화면을 마우스로 한 번 클릭</b>해야 키보드 입력이 게임 내부로 전달됩니다.</li>
      </ol>
    `},{id:"controls",title:"3. 키보드 및 마우스 조작법",html:`
      <h3 style="margin:0 0 8px;color:#000080;border-bottom:1px solid #808080;padding-bottom:4px;">3. 실제 구현된 키보드 및 마우스 조작 방법</h3>
      <div style="margin-bottom:10px;padding:6px 8px;background:#ffffe1;border:1px solid #808080;line-height:1.5;">
        <b>💡 DOS 타자게임(한컴 97 · 한메 3.0) 한/영 전환 핵심 안내</b><br>
        PC(Windows)의 한/영 상태는 <b>영문(A)</b>으로 둔 상태에서, 게임 화면을 클릭한 뒤 <b>Shift + Space</b>(또는 우측 한/영 키)를 누르면 DOS 프로그램 내부에서 한글/영문이 정확하게 전환됩니다.
      </div>
      <h4 style="margin:6px 0 4px;color:#000080;">■ 한컴타자연습 97 &amp; 한메타자교사 3.0</h4>
      <ul style="margin:0 0 8px;padding-left:18px;line-height:1.5;">
        <li><b>메뉴 이동 및 선택</b>: 방향키(<code>&uarr;</code> <code>&darr;</code> <code>&larr;</code> <code>&rarr;</code>), <code>Enter</code>(선택), <code>ESC</code>(이전 메뉴/중단)</li>
        <li><b>DOS 내부 한/영 전환</b>: <code>Shift + Space</code></li>
      </ul>
      <h4 style="margin:6px 0 4px;color:#000080;">■ 피카츄 배구</h4>
      <ul style="margin:0 0 8px;padding-left:18px;line-height:1.5;">
        <li><b>1인용 AI 대전 (혼자 하기)</b>: 방향키(<code>&larr;</code> <code>&uarr;</code> <code>&rarr;</code> <code>&darr;</code>) 이동 + <code>Enter</code> 또는 <code>Z</code> 스파이크/다이빙 (또는 <code>R D F G</code> 이동 + <code>Z</code> 스파이크 모두 지원)</li>
        <li><b>2인용 로컬 대전 (둘이서 하기)</b>: 1P(왼쪽)는 <code>R D F G</code> 이동 + <code>Z</code> 스파이크 / 2P(오른쪽)는 방향키 이동 + <code>Enter</code> 스파이크</li>
      </ul>
    `},{id:"modes",title:"4. 연습 모드와 대결 모드",html:`
      <h3 style="margin:0 0 8px;color:#000080;border-bottom:1px solid #808080;padding-bottom:4px;">4. 연습 모드와 대결/게임 모드 설명</h3>
      <ul style="margin:0 0 10px;padding-left:18px;line-height:1.6;">
        <li><b>한컴타자연습 97</b>:
          <ul>
            <li><b>연습 모드</b>: 자리연습, 낱말연습, 짧은글 연습, 긴글 연습 (타수 <code>타/분</code> 및 정확도 <code>%</code> 중심)</li>
            <li><b>타자 게임 모드</b>: 산성비, 침략자 (최고 점수 <code>점</code> 중심)</li>
          </ul>
        </li>
        <li><b>한메타자교사 3.0</b>:
          <ul>
            <li><b>연습 모드</b>: 자리연습, 낱말연습, 단문연습, 장문연습 (타수 <code>타/분</code> 중심)</li>
            <li><b>타자 게임 모드</b>: 베네치아 타자 게임 (최고 점수 <code>점</code> 중심)</li>
          </ul>
        </li>
        <li><b>피카츄 배구</b>:
          <ul>
            <li><b>컴퓨터 AI 대전 (공식 랭킹 모드)</b>: AI와 15점 내기 경기를 치르며 경기 완료 시 승패, 점수, 소요 시간이 랭킹에 반영됩니다.</li>
            <li><b>2인 로컬 / 온라인 P2P 대전</b>: 한 키보드 2인 플레이 및 WebRTC 방 대전 모드로, 어뷰징 방지를 위해 일반 플레이(연습) 기록으로 분리 저장됩니다.</li>
          </ul>
        </li>
      </ul>
    `},{id:"recording",title:"5. 게임 기록 저장 기준",html:`
      <h3 style="margin:0 0 8px;color:#000080;border-bottom:1px solid #808080;padding-bottom:4px;">5. 게임 기록 저장 기준</h3>
      <p style="margin:0 0 8px;line-height:1.5;">
        단순히 게임을 실행하거나 창을 여는 것만으로는 어떠한 임의 점수나 승패도 생성되지 않습니다.
      </p>
      <ul style="margin:0 0 10px;padding-left:18px;line-height:1.6;">
        <li><b>세션 시작 (<code>game:start</code>)</b>: 게임 엔진이 로드되거나 대전을 시작할 때 세션 ID와 시작 시각만 기록합니다.</li>
        <li><b>정상 완료 (<code>game:complete</code>)</b>:
          <ul>
            <li><b>한컴 97 자리연습</b>: 완료 대화상자 감지 시 자동으로 타수·정확도·소요시간이 서버에 저장됩니다.</li>
            <li><b>한컴 97 / 한메 3.0 연습 및 게임</b>: 실제 타자 입력 세션 완료 후 상단 메뉴 <b>[게임(G) &rarr; 현재 연습/게임 결과 기록하기]</b>를 통해 측정된 실제 타수·정확도·점수를 모드별로 기록할 수 있으며, <code>HTP.SCO</code> / <code>HTT.STA</code> 원본 파일 스냅샷도 자동 보존됩니다.</li>
            <li><b>피카츄 배구 AI 대전</b>: 15점 경기가 종료되어 결과 창이 표시되는 즉시 점수·승패·소요시간이 자동 저장됩니다.</li>
          </ul>
        </li>
        <li><b>중도 종료 (<code>game:abort</code>)</b>: 경기가 끝나기 전에 나가거나 창을 닫은 경우 세션 상태가 <code>aborted</code>(연습/중단 기록)로만 남으며 공식 순위에는 반영되지 않습니다.</li>
      </ul>
    `},{id:"ranking",title:"6. 랭킹 집계 기준",html:`
      <h3 style="margin:0 0 8px;color:#000080;border-bottom:1px solid #808080;padding-bottom:4px;">6. 랭킹 집계 기준</h3>
      <ul style="margin:0 0 10px;padding-left:18px;line-height:1.6;">
        <li><b>게임 간 분리 원칙</b>: <b>한컴타자연습 97</b>과 <b>한메타자교사 3.0</b>의 기록은 절대 합산하지 않고 각각의 탭에서 독립 집계합니다.</li>
        <li><b>지표 분리 원칙</b>: 연습 모드의 <b>타자 속도(타/분)</b>와 산성비·침략자·베네치아의 <b>게임 점수(점)</b>는 서로 다른 지표이므로 세부 종목별로 분리하여 TOP 10을 산정합니다.</li>
        <li><b>피카츄 배구 집계</b>: 실제 검증 가능한 <b>AI 대전 완료 기록(최고 점수 순위 / 다승 순위)</b>을 공식 랭킹으로 집계하며, 한쪽 클라이언트의 일방적 온라인 신고나 로컬 2P 연습은 랭킹에서 제외합니다.</li>
        <li><b>동일 사용자 최고 기록 기준</b>: 한 사용자가 같은 종목을 여러 번 플레이한 경우 가장 높은 기록 1건이 TOP 10 순위표에 대표로 표시됩니다.</li>
      </ul>
    `},{id:"nickname",title:"7. 닉네임 변경 방법",html:`
      <h3 style="margin:0 0 8px;color:#000080;border-bottom:1px solid #808080;padding-bottom:4px;">7. 닉네임 등록 및 변경 방법</h3>
      <ul style="margin:0 0 10px;padding-left:18px;line-height:1.6;">
        <li>최초 접속 시 등록한 닉네임은 브라우저 고유 식별자(<code>guestId</code>)와 함께 저장되어 매번 다시 입력할 필요가 없습니다.</li>
        <li><b>닉네임 변경 위치</b>:
          <ol>
            <li>오른쪽 <b>[GAME RANKING]</b> 창 하단의 <b>[닉네임 변경...]</b> 버튼 클릭</li>
            <li>또는 상단 GAME-BOX 헤더의 <b>[닉네임 변경]</b> 버튼 클릭</li>
          </ol>
        </li>
        <li><b>기록 유지 보장</b>: 닉네임을 변경하더라도 사용자 식별은 고유 <code>guestId</code>를 기준으로 유지되므로, <b>이전에 달성한 모든 게임 기록과 랭킹 순위의 이름도 새 닉네임으로 자동 반영</b>됩니다.</li>
      </ul>
    `}];class g extends n{static config={id:"retro-game-guide",title:"게임 가이드 — Windows 98 도움말",description:"한컴타자 · 한메타자 · 피카츄 배구 실행 및 랭킹 안내",icon:r.gameGuide,category:"보조프로그램/게임",width:620,height:440,resizable:!0,isSingleton:!0};constructor(i){super(i),this.activeSectionId="intro"}_createWindow(){const i=new window.$Window({title:this.title,icons:this.icon,outerWidth:this.width,outerHeight:this.height,resizable:!0}),o=new window.MenuBar({"파일(&F)":[{label:"닫기(&X)",action:()=>i.close()}],"게임 바로 실행(&G)":[{label:"한컴타자연습 97 실행(&H)",action:()=>window.System?.launchApp("hancom-typing-97")},{label:"한메타자교사 3.0 실행(&M)",action:()=>window.System?.launchApp("hanme-typing-30")},{label:"피카츄 배구 실행(&P)",action:()=>window.System?.launchApp("pikachu-volleyball")},"MENU_DIVIDER",{label:"GAME RANKING 창 열기(&R)",action:()=>window.System?.launchApp("retro-ranking")}]});return i.setMenuBar(o),i.$content.css({padding:"6px",background:"#c0c0c0",display:"flex",flexDirection:"column",gap:"6px",fontFamily:'"Pixelated MS Sans Serif", "굴림", "Gulim", Tahoma, sans-serif',fontSize:"12px",color:"#000",overflow:"hidden"}),i.$content.html(`
      <div style="display:flex;gap:6px;flex:1 1 auto;min-height:0;">
        <div class="guide-toc inset-deep" style="width:185px;background:#ffffff;padding:4px;overflow-y:auto;border:2px inset #808080;flex-shrink:0;">
          <div style="font-weight:bold;padding:3px 4px;color:#000080;border-bottom:1px solid #c0c0c0;margin-bottom:4px;">📖 목차 (Contents)</div>
          <div class="guide-toc-list" style="display:flex;flex-direction:column;gap:2px;"></div>
        </div>
        <div class="guide-body inset-deep" style="flex:1 1 auto;background:#ffffff;padding:12px 14px;overflow-y:auto;border:2px inset #808080;user-select:text;"></div>
      </div>
    `),this.$root=i.$content,this._renderGuide(),i}_renderGuide(){const i=this.$root.find(".guide-toc-list"),o=this.$root.find(".guide-body");i.empty(),l.forEach(e=>{const t=e.id===this.activeSectionId,b=window.$("<button type='button'>").text(e.title).css({textAlign:"left",padding:"4px 6px",background:t?"#000080":"transparent",color:t?"#ffffff":"#000000",border:"none",cursor:"pointer",fontSize:"11px",fontWeight:t?"bold":"normal"}).on("click",()=>{this.activeSectionId=e.id,this._renderGuide()});i.append(b)});const d=l.find(e=>e.id===this.activeSectionId)||l[0];o.html(d.html)}}export{g as RetroGameGuideApp};
