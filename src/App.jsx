import { useState } from 'react'

// ── 데이터 (나중에 Supabase로 교체 예정) ──────────────────────────────────────
const MOCK = {
  assignments: [
    { id:1, "과제명":"알고리즘 과제 3", "진행상황":"진행 중", "제출 방법":"온라인 제출", "데드라인":"2026-03-22" },
    { id:2, "과제명":"공학수학 숙제", "진행상황":"시작 전", "제출 방법":"직접 제출", "데드라인":"2026-03-28" },
    { id:3, "과제명":"데이터베이스 보고서", "진행상황":"완료", "제출 방법":"이메일", "데드라인":"2026-03-18" },
    { id:4, "과제명":"운영체제 실습", "진행상황":"제출 완료", "제출 방법":"온라인 제출", "데드라인":"2026-03-15" },
  ],
  exams: [
    { id:1, "시험명":"알고리즘 중간고사", "시험 구분":"중간고사", "시험 범위":"1~5장", "일시":"2026-04-10" },
    { id:2, "시험명":"공학수학 퀴즈", "시험 구분":"퀴즈", "시험 범위":"미분방정식", "일시":"2026-03-26" },
  ],
  timetable: [
    { id:1, "강의명":"알고리즘", "요일":["월","수"], "시작 시간":"09:00", "종료 시간":"10:30", "강의실":"창의관 301" },
    { id:2, "강의명":"공학수학", "요일":["화","목"], "시작 시간":"11:00", "종료 시간":"12:30", "강의실":"미래관 201" },
    { id:3, "강의명":"데이터베이스", "요일":["수"], "시작 시간":"13:00", "종료 시간":"16:00", "강의실":"제1공학관 405" },
    { id:4, "강의명":"운영체제", "요일":["금"], "시작 시간":"10:00", "종료 시간":"13:00", "강의실":"창의관 201" },
    { id:5, "강의명":"영어회화", "요일":["화"], "시작 시간":"14:00", "종료 시간":"15:30", "강의실":"인문관 102" },
  ],
  grades: [
    { id:1, "강의명":"알고리즘", "학점 수":3, "학기":"2025-1", "취득 등급":"A+" },
    { id:2, "강의명":"공학수학", "학점 수":3, "학기":"2025-1", "취득 등급":"B+" },
    { id:3, "강의명":"데이터베이스", "학점 수":3, "학기":"2025-1", "취득 등급":"A" },
    { id:4, "강의명":"운영체제", "학점 수":3, "학기":"2025-1", "취득 등급":"B" },
    { id:5, "강의명":"영어회화", "학점 수":2, "학기":"2025-1", "취득 등급":"A+" },
  ],
  bookmarks: [
    { id:1, "사이트명":"YouTube", "URL":"https://youtube.com", "카테고리":"기본", "아이콘":"▶️" },
    { id:2, "사이트명":"에브리타임", "URL":"https://everytime.kr", "카테고리":"기본", "아이콘":"📱" },
    { id:3, "사이트명":"네이버 사전", "URL":"https://dict.naver.com", "카테고리":"기본", "아이콘":"📖" },
    { id:4, "사이트명":"파파고", "URL":"https://papago.naver.com", "카테고리":"기본", "아이콘":"🌐" },
    { id:5, "사이트명":"네이버 지도", "URL":"https://map.naver.com", "카테고리":"기본", "아이콘":"🗺️" },
    { id:6, "사이트명":"서울과기대 포털", "URL":"https://portal.seoultech.ac.kr", "카테고리":"학교", "아이콘":"🏫" },
    { id:7, "사이트명":"통합정보시스템", "URL":"https://suis.seoultech.ac.kr", "카테고리":"학교", "아이콘":"🖥️" },
    { id:8, "사이트명":"수강신청", "URL":"https://for-s.seoultech.ac.kr", "카테고리":"수강신청", "아이콘":"📋" },
  ],
  specs: [
    { id:1, "스펙명":"TOEIC", "카테고리":"공인 시험", "현재 점수":"820", "목표 점수":"900", "상태":"준비 중" },
    { id:2, "스펙명":"정보처리기사", "카테고리":"자격증", "상태":"준비 중", "목표 점수":"합격" },
    { id:3, "스펙명":"SW 경진대회 수상", "카테고리":"대회", "상태":"취득 완료" },
  ],
  people: [
    { id:1, "이름":"김○○ 교수님", "구분":"교수님", "이메일":"prof.kim@seoultech.ac.kr", "위치":"창의관 514" },
    { id:2, "이름":"이○○ 조교", "구분":"조교", "이메일":"ta.lee@seoultech.ac.kr" },
    { id:3, "이름":"박민준", "구분":"친구", "전화번호":"010-1234-5678" },
  ],
  records: [
    { id:1, "제목":"인터스텔라", "카테고리":"🎬 영화", "별점":"⭐⭐⭐⭐⭐", "한줄 감상":"역대급 SF" },
    { id:2, "제목":"을지로 노포 순대국", "카테고리":"🍜 맛집", "별점":"⭐⭐⭐⭐", "한줄 감상":"가성비 최고" },
    { id:3, "제목":"클린 코드", "카테고리":"📖 책", "별점":"⭐⭐⭐⭐", "한줄 감상":"필독서" },
  ],
  buckets: [
    { id:1, "항목":"교환학생 가기", "카테고리":"경험", "시즌":"재학 중", "완료":false },
    { id:2, "항목":"TOEIC 900 달성", "카테고리":"스펙", "시즌":"여름방학", "완료":false },
    { id:3, "항목":"자전거로 한강 완주", "카테고리":"경험", "시즌":"여름방학", "완료":true },
    { id:4, "항목":"캡스톤 프로젝트 완성", "카테고리":"학습", "시즌":"2학기", "완료":false },
  ],
  teamwork: [
    { id:1, "프로젝트명":"캡스톤 디자인", "상태":"진행 중", "내 역할":"백엔드 개발", "마감일":"2026-06-10" },
    { id:2, "프로젝트명":"데이터베이스 팀플", "상태":"완료", "내 역할":"팀장" },
  ],
}

// ── 유틸 ──────────────────────────────────────────────────────────────────────
const today = new Date()
const DAYS = ["일","월","화","수","목","금","토"]
const MONTHS = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"]

function dday(s) {
  if (!s) return null
  const d = Math.ceil((new Date(s) - today) / 86400000)
  if (d === 0) return "D-DAY"
  return d > 0 ? `D-${d}` : `D+${Math.abs(d)}`
}

function gpa(g) {
  return {"A+":4.5,"A":4.0,"B+":3.5,"B":3.0,"C+":2.5,"C":2.0,"D+":1.5,"D":1.0,"F":0}[g] ?? null
}

const CC = [
  {bg:"rgba(124,106,255,0.2)",bl:"#7c6aff",t:"#c4baff"},
  {bg:"rgba(255,106,155,0.2)",bl:"#ff6a9b",t:"#ffb8d1"},
  {bg:"rgba(106,255,218,0.15)",bl:"#6affda",t:"#a0fff0"},
  {bg:"rgba(255,179,71,0.15)",bl:"#ffb347",t:"#ffd89a"},
  {bg:"rgba(77,255,180,0.15)",bl:"#4dffb4",t:"#a0ffe0"},
]

// ── CSS ───────────────────────────────────────────────────────────────────────
const globalCSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Noto+Sans+KR:wght@300;400;500;700&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg: #0a0a0f; --surface: #12121a; --surface2: #1a1a26;
  --border: rgba(255,255,255,0.06); --border2: rgba(255,255,255,0.12);
  --text: #e8e8f0; --muted: rgba(232,232,240,0.45);
  --accent: #7c6aff; --accent2: #ff6a9b; --accent3: #6affda;
  --warn: #ffb347; --danger: #ff5f7a; --success: #4dffb4;
  --r: 14px;
}
html, body, #root { height: 100%; }
body { background:var(--bg); color:var(--text); font-family:'Noto Sans KR',sans-serif; overflow:hidden; }
.layout { display:flex; height:100vh; }
.sidebar { width:64px; background:var(--surface); border-right:1px solid var(--border); display:flex; flex-direction:column; align-items:center; padding:14px 0; gap:4px; flex-shrink:0; }
.logo { width:36px; height:36px; border-radius:10px; background:linear-gradient(135deg,var(--accent),var(--accent2)); display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-weight:800; font-size:12px; color:white; margin-bottom:10px; letter-spacing:-0.5px; }
.nb { width:40px; height:40px; border-radius:10px; border:none; cursor:pointer; background:transparent; color:var(--muted); font-size:17px; display:flex; align-items:center; justify-content:center; transition:all 0.15s; position:relative; }
.nb:hover { background:var(--surface2); color:var(--text); }
.nb.on { background:rgba(124,106,255,0.18); color:var(--accent); }
.tip { position:absolute; left:50px; background:var(--surface2); border:1px solid var(--border2); padding:3px 9px; border-radius:7px; font-size:11px; white-space:nowrap; color:var(--text); opacity:0; pointer-events:none; transition:opacity 0.15s; z-index:999; font-family:'Noto Sans KR',sans-serif; }
.nb:hover .tip { opacity:1; }
.main { flex:1; overflow-y:auto; padding:24px; min-width:0; }
.hdr { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; }
.htitle { font-family:'Syne',sans-serif; font-weight:700; font-size:20px; }
.hdate { color:var(--muted); font-size:12px; margin-top:2px; }
.tag { display:inline-flex; align-items:center; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:500; }
.card { background:var(--surface); border:1px solid var(--border); border-radius:var(--r); padding:16px; transition:border-color 0.2s; }
.card:hover { border-color:var(--border2); }
.ct { font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.1em; color:var(--muted); margin-bottom:12px; }
.g2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px; }
.g4 { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:12px; }
.tth { display:grid; grid-template-columns:40px repeat(7,1fr); }
.ttd { text-align:center; padding:5px 2px; font-size:10px; font-weight:600; color:var(--muted); }
.ttd.tc { color:var(--accent); }
.ttr { display:grid; grid-template-columns:40px repeat(7,1fr); border-top:1px solid var(--border); min-height:32px; }
.ttt { font-size:9px; color:var(--muted); padding:3px 5px 0 0; text-align:right; }
.ttc { border-left:1px solid var(--border); position:relative; }
.ttcls { position:absolute; left:2px; right:2px; border-radius:5px; padding:3px 5px; font-size:9px; font-weight:600; line-height:1.3; overflow:hidden; z-index:1; }
.ai { display:flex; align-items:center; gap:10px; padding:9px 0; border-bottom:1px solid var(--border); }
.ai:last-child { border-bottom:none; }
.sd { width:7px; height:7px; border-radius:50%; flex-shrink:0; }
.dd { margin-left:auto; padding:2px 8px; border-radius:20px; font-size:10px; font-weight:700; white-space:nowrap; }
.cg { display:grid; grid-template-columns:repeat(7,1fr); gap:2px; }
.cdh { text-align:center; font-size:9px; color:var(--muted); padding:3px; font-weight:600; }
.cd { aspect-ratio:1; border-radius:6px; display:flex; flex-direction:column; align-items:center; justify-content:flex-start; padding:3px; font-size:11px; cursor:pointer; transition:background 0.1s; }
.cd:hover { background:var(--surface2); }
.cd.td { background:var(--accent); color:#fff; font-weight:700; }
.cd.om { opacity:0.2; }
.dot { width:3px; height:3px; border-radius:50%; background:var(--accent2); margin-top:1px; }
.gw { margin-bottom:9px; }
.gl { display:flex; justify-content:space-between; font-size:11px; margin-bottom:3px; }
.gt { height:5px; background:var(--surface2); border-radius:3px; overflow:hidden; }
.gf { height:100%; border-radius:3px; transition:width 1s ease; }
.bmg { display:grid; grid-template-columns:repeat(4,1fr); gap:6px; }
.bmi { background:var(--surface2); border:1px solid var(--border); border-radius:9px; padding:10px; cursor:pointer; transition:all 0.2s; text-decoration:none; display:block; }
.bmi:hover { border-color:var(--accent); transform:translateY(-2px); }
.pc { display:flex; align-items:center; gap:9px; padding:8px 0; border-bottom:1px solid var(--border); }
.pc:last-child { border-bottom:none; }
.av { width:32px; height:32px; border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; }
.si { padding:8px 0; border-bottom:1px solid var(--border); }
.si:last-child { border-bottom:none; }
.sh { display:flex; align-items:center; justify-content:space-between; margin-bottom:2px; }
.bi { display:flex; align-items:center; gap:8px; padding:7px 0; border-bottom:1px solid var(--border); }
.bi:last-child { border-bottom:none; }
.cb { width:16px; height:16px; border-radius:4px; border:2px solid var(--border2); display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:9px; cursor:pointer; transition:all 0.15s; }
.cb.dn { background:var(--success); border-color:var(--success); color:#000; }
.tabs { display:flex; gap:2px; background:var(--surface2); border-radius:8px; padding:3px; margin-bottom:14px; flex-wrap:wrap; }
.tab { padding:4px 11px; border-radius:6px; border:none; cursor:pointer; font-size:11px; font-weight:500; background:transparent; color:var(--muted); transition:all 0.1s; font-family:'Noto Sans KR',sans-serif; }
.tab.on { background:var(--surface); color:var(--text); }
.sc { background:var(--surface); border:1px solid var(--border); border-radius:var(--r); padding:16px; }
.sv { font-family:'Syne',sans-serif; font-size:28px; font-weight:700; }
.sl { font-size:11px; color:var(--muted); margin-top:2px; }
.ri { display:flex; align-items:center; gap:9px; padding:8px 0; border-bottom:1px solid var(--border); }
.ri:last-child { border-bottom:none; }
.empty { text-align:center; padding:28px; color:var(--muted); font-size:12px; }
.ei { font-size:26px; margin-bottom:6px; }
::-webkit-scrollbar { width:3px; }
::-webkit-scrollbar-thumb { background:var(--border2); border-radius:2px; }
`

// ── 컴포넌트 ──────────────────────────────────────────────────────────────────

function Timetable() {
  const hrs = Array.from({length:14},(_,i)=>i+8)
  const days = ["월","화","수","목","금","토","일"]
  const td = DAYS[today.getDay()]
  const cm = {}; let ci = 0
  const cls = MOCK.timetable.map(x => {
    if (!cm[x["강의명"]]) cm[x["강의명"]] = CC[ci++ % CC.length]
    return { ...x, c: cm[x["강의명"]] }
  })
  return (
    <div className="card" style={{overflowX:'auto'}}>
      <div className="ct">🗓 시간표</div>
      <div style={{minWidth:520}}>
        <div className="tth">
          <div/>
          {days.map(d => <div key={d} className={`ttd${d===td?' tc':''}`}>{d}</div>)}
        </div>
        {hrs.map(h => (
          <div key={h} className="ttr">
            <div className="ttt">{h}:00</div>
            {days.map(d => {
              const x = cls.find(c => {
                const ds = Array.isArray(c["요일"]) ? c["요일"] : [c["요일"]||""]
                return ds.includes(d) && parseInt((c["시작 시간"]||"0").split(":")[0]) === h
              })
              return (
                <div key={d} className="ttc">
                  {x && (
                    <div className="ttcls" style={{
                      background:x.c.bg, borderLeft:`3px solid ${x.c.bl}`, color:x.c.t, top:0,
                      height:`${(parseInt((x["종료 시간"]||"0").split(":")[0])-parseInt((x["시작 시간"]||"0").split(":")[0]))*32}px`
                    }}>
                      <div style={{fontWeight:700}}>{x["강의명"]}</div>
                      <div style={{opacity:.7,fontSize:8}}>{x["강의실"]}</div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

function Assignments({ data, setData }) {
  const [tab, setTab] = useState("진행 중")
  const items = (data||[]).filter(a => tab==="전체" || a["진행상황"]===tab)
  const sc = {"시작 전":"var(--muted)","진행 중":"var(--warn)","완료":"var(--accent)","제출 완료":"var(--success)"}
  const ds = d => {
    if (!d) return {}
    if (d==="D-DAY") return {background:"rgba(255,95,122,0.2)",color:"var(--danger)"}
    const n = parseInt(d.replace("D-",""))
    if (!isNaN(n) && n<=3) return {background:"rgba(255,179,71,0.2)",color:"var(--warn)"}
    return {background:"var(--surface2)",color:"var(--muted)"}
  }
  return (
    <div className="card">
      <div className="ct">📝 과제 트래커</div>
      <div className="tabs">
        {["진행 중","시작 전","완료","제출 완료","전체"].map(t => (
          <button key={t} className={`tab${tab===t?' on':''}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>
      {items.length === 0
        ? <div className="empty"><div className="ei">✅</div>항목 없음!</div>
        : items.map(a => (
          <div key={a.id} className="ai">
            <div className="sd" style={{background:sc[a["진행상황"]]||"var(--muted)"}}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:500,fontSize:13}}>{a["과제명"]}</div>
              <div style={{fontSize:10,color:"var(--muted)",marginTop:1}}>{a["제출 방법"]||""}</div>
            </div>
            {a["데드라인"] && (
              <span className="dd" style={ds(dday(a["데드라인"]))}>{dday(a["데드라인"])}</span>
            )}
          </div>
        ))
      }
    </div>
  )
}

function Exams() {
  const up = MOCK.exams
    .filter(x => x["일시"] && new Date(x["일시"]) >= today)
    .sort((a,b) => new Date(a["일시"]) - new Date(b["일시"]))
  const tc = {"중간고사":"var(--danger)","기말고사":"var(--accent2)","퀴즈":"var(--warn)","과제 발표":"var(--accent3)"}
  return (
    <div className="card">
      <div className="ct">📅 시험 알리미</div>
      {up.length === 0
        ? <div className="empty"><div className="ei">🎉</div>예정된 시험 없음</div>
        : up.map(x => (
          <div key={x.id} className="ai">
            <div style={{flex:1}}>
              <div style={{display:'flex',alignItems:'center',gap:6}}>
                <span className="tag" style={{background:`${tc[x["시험 구분"]]||"var(--accent)"}22`,color:tc[x["시험 구분"]]||"var(--accent)",fontSize:9,padding:'2px 7px'}}>
                  {x["시험 구분"]||"시험"}
                </span>
                <span style={{fontWeight:500,fontSize:13}}>{x["시험명"]}</span>
              </div>
              {x["시험 범위"] && <div style={{fontSize:10,color:"var(--muted)",marginTop:2}}>범위: {x["시험 범위"]}</div>}
            </div>
            <span className="dd" style={{background:"rgba(124,106,255,0.2)",color:"var(--accent)"}}>
              {dday(x["일시"])}
            </span>
          </div>
        ))
      }
    </div>
  )
}

function Calendar() {
  const [cur, setCur] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const yr = cur.getFullYear(), mo = cur.getMonth()
  const fd = new Date(yr,mo,1).getDay()
  const dim = new Date(yr,mo+1,0).getDate()
  const dipm = new Date(yr,mo,0).getDate()
  const evts = new Set([
    ...MOCK.assignments.map(a => a["데드라인"]||""),
    ...MOCK.exams.map(x => x["일시"]||""),
  ].filter(Boolean))
  const cells = []
  for (let i=0; i<fd; i++) cells.push({d:dipm-fd+1+i, c:false})
  for (let i=1; i<=dim; i++) cells.push({d:i, c:true})
  while (cells.length%7 !== 0) cells.push({d:cells.length-dim-fd+1, c:false})
  return (
    <div className="card">
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
        <div className="ct" style={{margin:0}}>📆 캘린더</div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <button onClick={() => setCur(new Date(yr,mo-1,1))} style={{background:'none',border:'none',cursor:'pointer',color:'var(--muted)',fontSize:14}}>‹</button>
          <span style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:12}}>{yr}년 {MONTHS[mo]}</span>
          <button onClick={() => setCur(new Date(yr,mo+1,1))} style={{background:'none',border:'none',cursor:'pointer',color:'var(--muted)',fontSize:14}}>›</button>
        </div>
      </div>
      <div className="cg">
        {["일","월","화","수","목","금","토"].map(d => (
          <div key={d} className="cdh" style={{color:d==="일"?"var(--danger)":d==="토"?"var(--accent)":"var(--muted)"}}>{d}</div>
        ))}
        {cells.map((c,i) => {
          const ds = c.c ? `${yr}-${String(mo+1).padStart(2,'0')}-${String(c.d).padStart(2,'0')}` : ""
          const isTd = c.c && c.d===today.getDate() && mo===today.getMonth() && yr===today.getFullYear()
          return (
            <div key={i} className={`cd${isTd?' td':''}${!c.c?' om':''}`}>
              {c.d}
              {evts.has(ds) && !isTd && <div className="dot"/>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Grades() {
  const items = MOCK.grades
  const sems = [...new Set(items.map(i=>i["학기"]).filter(Boolean))].sort().reverse()
  const [sem, setSem] = useState(sems[0]||"2025-1")
  const fil = items.filter(i => i["학기"]===sem)
  const tc = fil.reduce((s,i) => s+(i["학점 수"]||0), 0)
  const ws = fil.reduce((s,i) => { const g=gpa(i["취득 등급"]); return s+(g!==null?g*(i["학점 수"]||0):0) }, 0)
  const avg = tc > 0 ? (ws/tc).toFixed(2) : "-"
  return (
    <div className="card">
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
        <div className="ct" style={{margin:0}}>📊 성적 계산기</div>
        <select value={sem} onChange={e=>setSem(e.target.value)} style={{background:'var(--surface2)',border:'1px solid var(--border)',color:'var(--text)',borderRadius:7,padding:'3px 7px',fontSize:10}}>
          {sems.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div style={{display:'flex',alignItems:'baseline',gap:6,marginBottom:16}}>
        <span style={{fontFamily:'Syne',fontWeight:800,fontSize:34,color:'var(--accent)'}}>{avg}</span>
        <span style={{color:'var(--muted)',fontSize:11}}>/ 4.5 · {tc}학점</span>
      </div>
      {fil.map(c => {
        const g = gpa(c["취득 등급"])
        const pct = g !== null ? (g/4.5*100) : 0
        const bc = g>=4.0?"var(--success)":g>=3.0?"var(--accent)":g>=2.0?"var(--warn)":"var(--danger)"
        return (
          <div key={c.id} className="gw">
            <div className="gl">
              <span style={{fontSize:11}}>{c["강의명"]}</span>
              <span style={{fontWeight:700,color:bc}}>{c["취득 등급"]||"—"}</span>
            </div>
            <div className="gt"><div className="gf" style={{width:`${pct}%`,background:bc}}/></div>
          </div>
        )
      })}
    </div>
  )
}

function Bookmarks() {
  return (
    <div className="card">
      <div className="ct">🔗 사이트 바로가기</div>
      <div className="bmg">
        {MOCK.bookmarks.map(b => (
          <a key={b.id} href={b["URL"]||"#"} target="_blank" rel="noreferrer" className="bmi">
            <div style={{fontSize:18,marginBottom:4}}>{b["아이콘"]||"🌐"}</div>
            <div style={{fontSize:11,fontWeight:500,color:'var(--text)'}}>{b["사이트명"]}</div>
            <div style={{fontSize:9,color:'var(--muted)',marginTop:1}}>{b["카테고리"]||""}</div>
          </a>
        ))}
      </div>
    </div>
  )
}

function People() {
  const ac = ["var(--accent)","var(--accent2)","var(--accent3)","var(--warn)","var(--success)"]
  return (
    <div className="card">
      <div className="ct">👥 인간 정보</div>
      {MOCK.people.map((p,i) => (
        <div key={p.id} className="pc">
          <div className="av" style={{background:`${ac[i%ac.length]}25`,color:ac[i%ac.length]}}>
            {(p["이름"]||"?")[0]}
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:12,fontWeight:500}}>{p["이름"]}</div>
            <div style={{fontSize:10,color:'var(--muted)'}}>{p["구분"]}{p["이메일"]?` · ${p["이메일"]}`:''}</div>
          </div>
          {p["전화번호"] && <span style={{fontSize:14}}>📞</span>}
        </div>
      ))}
    </div>
  )
}

function Specs() {
  const sc = {"준비 중":"var(--warn)","취득 완료":"var(--success)","만료 임박":"var(--danger)","만료":"var(--muted)"}
  return (
    <div className="card">
      <div className="ct">🏆 스펙 관리</div>
      {MOCK.specs.map(s => (
        <div key={s.id} className="si">
          <div className="sh">
            <div style={{fontSize:12,fontWeight:500}}>{s["스펙명"]}</div>
            <span className="tag" style={{background:`${sc[s["상태"]]||"var(--muted)"}22`,color:sc[s["상태"]]||"var(--muted)",fontSize:9,padding:'2px 7px'}}>
              {s["상태"]||"기타"}
            </span>
          </div>
          <div style={{fontSize:10,color:'var(--muted)',display:'flex',gap:8}}>
            {s["카테고리"] && <span>{s["카테고리"]}</span>}
            {s["현재 점수"] && <span>현재: {s["현재 점수"]}</span>}
            {s["목표 점수"] && <span>목표: {s["목표 점수"]}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}

function Records() {
  const [cat, setCat] = useState("전체")
  const cats = ["전체","🍜 맛집","📖 책","🎬 영화","📹 영상","🛍 제품"]
  const fil = MOCK.records.filter(r => cat==="전체" || r["카테고리"]===cat)
  return (
    <div className="card">
      <div className="ct">📚 나만의 기록장</div>
      <div className="tabs">
        {cats.map(c => <button key={c} className={`tab${cat===c?' on':''}`} onClick={()=>setCat(c)}>{c}</button>)}
      </div>
      {fil.map(r => (
        <div key={r.id} className="ri">
          <span style={{fontSize:15}}>{(r["카테고리"]||"").split(" ")[0]||"📌"}</span>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:12,fontWeight:500}}>{r["제목"]}</div>
            {r["한줄 감상"] && <div style={{fontSize:10,color:'var(--muted)'}}>{r["한줄 감상"]}</div>}
          </div>
          <div style={{color:'#ffb347',fontSize:10}}>{r["별점"]||""}</div>
        </div>
      ))}
      {fil.length === 0 && <div className="empty"><div className="ei">📚</div>기록을 추가해주세요</div>}
    </div>
  )
}

function Bucket() {
  const [items, setItems] = useState(MOCK.buckets)
  const done = items.filter(b=>b["완료"]).length
  const toggle = id => setItems(prev => prev.map(b => b.id===id ? {...b, 완료:!b["완료"]} : b))
  return (
    <div className="card">
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
        <div className="ct" style={{margin:0}}>🪣 버킷리스트</div>
        <span style={{fontSize:10,color:'var(--muted)'}}>{done}/{items.length} 완료</span>
      </div>
      <div style={{height:4,background:'var(--surface2)',borderRadius:2,marginBottom:12,overflow:'hidden'}}>
        <div style={{height:'100%',width:`${items.length>0?done/items.length*100:0}%`,background:'var(--success)',borderRadius:2,transition:'width 0.5s'}}/>
      </div>
      {items.map(b => (
        <div key={b.id} className="bi">
          <div className={`cb${b["완료"]?' dn':''}`} onClick={()=>toggle(b.id)}>{b["완료"]&&'✓'}</div>
          <div style={{flex:1}}>
            <div style={{fontSize:12,fontWeight:500,textDecoration:b["완료"]?'line-through':'none',opacity:b["완료"]?0.5:1}}>{b["항목"]}</div>
            {b["시즌"] && <div style={{fontSize:10,color:'var(--muted)'}}>{b["시즌"]}</div>}
          </div>
          {b["카테고리"] && <span style={{fontSize:10,color:'var(--muted)'}}>{b["카테고리"]}</span>}
        </div>
      ))}
    </div>
  )
}

function Teamwork() {
  const sc = {"준비":"var(--muted)","진행 중":"var(--warn)","완료":"var(--success)"}
  return (
    <div className="card">
      <div className="ct">🤝 팀플 아카이브</div>
      {MOCK.teamwork.map(t => (
        <div key={t.id} className="ai">
          <div style={{flex:1}}>
            <div style={{fontWeight:500,fontSize:12}}>{t["프로젝트명"]}</div>
            {t["내 역할"] && <div style={{fontSize:10,color:'var(--muted)'}}>내 역할: {t["내 역할"]}</div>}
          </div>
          {t["상태"] && (
            <span className="tag" style={{background:`${sc[t["상태"]]}22`,color:sc[t["상태"]],fontSize:10,padding:'2px 8px'}}>
              {t["상태"]}
            </span>
          )}
          {t["마감일"] && (
            <span className="dd" style={{background:'var(--surface2)',color:'var(--muted)'}}>
              {dday(t["마감일"])}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

// ── 메인 ──────────────────────────────────────────────────────────────────────
const VIEWS = [
  {id:"home",icon:"⚡",label:"홈"},
  {id:"schedule",icon:"🗓",label:"시간표"},
  {id:"todo",icon:"📋",label:"할 일"},
  {id:"grades",icon:"📊",label:"성적"},
  {id:"specs",icon:"🏆",label:"스펙"},
  {id:"people",icon:"👥",label:"인맥"},
  {id:"records",icon:"📚",label:"기록"},
  {id:"bucket",icon:"🪣",label:"버킷"},
  {id:"team",icon:"🤝",label:"팀플"},
  {id:"links",icon:"🔗",label:"링크"},
]

export default function App() {
  const [view, setView] = useState("home")
  const [assignments] = useState(MOCK.assignments)

  const urgent = assignments.filter(a => {
    const d = a["데드라인"]; if (!d) return false
    const df = Math.ceil((new Date(d)-today)/86400000)
    return df>=0 && df<=3 && a["진행상황"]!=="제출 완료"
  })
  const upEx = MOCK.exams.filter(x => x["일시"] && new Date(x["일시"])>=today).length
  const v = VIEWS.find(x=>x.id===view)

  return (
    <>
      <style>{globalCSS}</style>
      <div className="layout">
        <nav className="sidebar">
          <div className="logo">서T</div>
          {VIEWS.map(v => (
            <button key={v.id} className={`nb${view===v.id?' on':''}`} onClick={()=>setView(v.id)}>
              {v.icon}
              <span className="tip">{v.label}</span>
            </button>
          ))}
        </nav>
        <main className="main">
          <div className="hdr">
            <div>
              <div className="htitle">{v.icon} {v.label}</div>
              <div className="hdate">{today.getFullYear()}년 {MONTHS[today.getMonth()]} {today.getDate()}일 {DAYS[today.getDay()]}요일</div>
            </div>
            <div style={{display:'flex',gap:6}}>
              {urgent.length>0 && <span className="tag" style={{background:'rgba(255,179,71,0.15)',color:'var(--warn)'}}>⚠️ 마감 임박 {urgent.length}개</span>}
              {upEx>0 && <span className="tag" style={{background:'rgba(255,95,122,0.15)',color:'var(--danger)'}}>📝 예정 시험 {upEx}개</span>}
            </div>
          </div>

          {view==="home" && <>
            <div className="g4">
              <div className="sc"><div className="sv" style={{color:'var(--warn)'}}>{urgent.length}</div><div className="sl">마감 임박 과제</div></div>
              <div className="sc"><div className="sv" style={{color:'var(--danger)'}}>{upEx}</div><div className="sl">예정된 시험</div></div>
              <div className="sc"><div className="sv" style={{color:'var(--accent)'}}>{assignments.filter(a=>a["진행상황"]==="진행 중").length}</div><div className="sl">진행 중 과제</div></div>
              <div className="sc"><div className="sv" style={{color:'var(--success)'}}>{assignments.filter(a=>a["진행상황"]==="제출 완료").length}</div><div className="sl">완료된 과제</div></div>
            </div>
            <div className="g2">
              <Calendar/>
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                <Assignments data={assignments}/>
                <Exams/>
              </div>
            </div>
            <Bookmarks/>
          </>}

          {view==="schedule" && <Timetable/>}
          {view==="todo" && <div className="g2"><Assignments data={assignments}/><Exams/></div>}
          {view==="grades" && <Grades/>}
          {view==="specs" && <Specs/>}
          {view==="people" && <People/>}
          {view==="records" && <Records/>}
          {view==="bucket" && <Bucket/>}
          {view==="team" && <Teamwork/>}
          {view==="links" && <Bookmarks/>}
        </main>
      </div>
    </>
  )
}
