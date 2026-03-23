import { useState, useEffect } from 'react'

function useStorage(key, init) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init }
    catch { return init }
  })
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(val)) } catch {} }, [key, val])
  return [val, setVal]
}

const INIT = {
  timetable: [],
  assignments: [],
  grades: [],
  bookmarks: [
    { id:1, "사이트명":"YouTube", "URL":"https://youtube.com", "카테고리":"기본" },
    { id:2, "사이트명":"에브리타임", "URL":"https://everytime.kr", "카테고리":"기본" },
    { id:3, "사이트명":"네이버 사전", "URL":"https://dict.naver.com", "카테고리":"기본" },
    { id:4, "사이트명":"파파고", "URL":"https://papago.naver.com", "카테고리":"기본" },
    { id:5, "사이트명":"네이버 지도", "URL":"https://map.naver.com", "카테고리":"기본" },
    { id:6, "사이트명":"서울과기대 포털", "URL":"https://portal.seoultech.ac.kr", "카테고리":"학교" },
    { id:7, "사이트명":"통합정보시스템", "URL":"https://suis.seoultech.ac.kr", "카테고리":"학교" },
    { id:8, "사이트명":"수강신청", "URL":"https://for-s.seoultech.ac.kr", "카테고리":"수강신청" },
  ],
  exams: [],
  specs: [],
  people: [],
  records: [],
  buckets: [],
  teamwork: [],
}

const today = new Date()
const DAYS = ["일","월","화","수","목","금","토"]
const MONTHS = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"]
const newId = (arr) => (Math.max(0, ...arr.map(x=>x.id)) + 1)
const thisYear = today.getFullYear()
const todayStr = today.toISOString().slice(0,10)
const defaultDeadline = todayStr + "T23:59"

function dday(s) {
  if (!s) return null
  const d = Math.ceil((new Date(s) - today) / 86400000)
  if (d === 0) return "D-DAY"
  return d > 0 ? "D-"+d : "D+"+Math.abs(d)
}
function isPast(s) { if (!s) return false; return new Date(s) < today }
function gpa(g) { return {"A+":4.5,"A":4.0,"B+":3.5,"B":3.0,"C+":2.5,"C":2.0,"D+":1.5,"D":1.0,"F":0}[g] ?? null }
function fmtDate(s) { if (!s) return ""; return s.slice(0,10) }

// favicon from URL
function getFavicon(url) {
  try {
    const u = url.startsWith("http") ? url : "https://"+url
    const origin = new URL(u).origin
    return `https://www.google.com/s2/favicons?domain=${origin}&sz=64`
  } catch { return null }
}

const CC = [
  {bg:"rgba(124,106,255,0.2)",bl:"#7c6aff",t:"#c4baff"},
  {bg:"rgba(255,106,155,0.2)",bl:"#ff6a9b",t:"#ffb8d1"},
  {bg:"rgba(106,255,218,0.15)",bl:"#6affda",t:"#a0fff0"},
  {bg:"rgba(255,179,71,0.15)",bl:"#ffb347",t:"#ffd89a"},
  {bg:"rgba(77,255,180,0.15)",bl:"#4dffb4",t:"#a0ffe0"},
]

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Noto+Sans+KR:wght@400;500;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#0a0a0f;--surface:#12121a;--surface2:#1a1a26;--border:rgba(255,255,255,0.06);--border2:rgba(255,255,255,0.12);--text:#e8e8f0;--muted:rgba(232,232,240,0.45);--accent:#7c6aff;--accent2:#ff6a9b;--accent3:#6affda;--warn:#ffb347;--danger:#ff5f7a;--success:#4dffb4;--r:14px}
html,body,#root{height:100%}
body{background:var(--bg);color:var(--text);font-family:'Noto Sans KR',sans-serif;overflow:hidden}
.layout{display:flex;height:100vh}
.sidebar{width:64px;background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;align-items:center;padding:14px 0;gap:4px;flex-shrink:0}
.logo{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:12px;color:white;margin-bottom:10px}
.nb{width:40px;height:40px;border-radius:10px;border:none;cursor:pointer;background:transparent;color:var(--muted);font-size:17px;display:flex;align-items:center;justify-content:center;transition:all .15s;position:relative}
.nb:hover{background:var(--surface2);color:var(--text)}
.nb.on{background:rgba(124,106,255,0.18);color:var(--accent)}
.tip{position:absolute;left:50px;background:var(--surface2);border:1px solid var(--border2);padding:3px 9px;border-radius:7px;font-size:11px;white-space:nowrap;color:var(--text);opacity:0;pointer-events:none;transition:opacity .15s;z-index:999;font-family:'Noto Sans KR',sans-serif}
.nb:hover .tip{opacity:1}
.main{flex:1;overflow-y:auto;padding:24px;min-width:0}
.hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}
.htitle{font-family:'Syne',sans-serif;font-weight:700;font-size:20px}
.hdate{color:var(--muted);font-size:12px;margin-top:2px}
.tag{display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:500}
.card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:16px;transition:border-color .2s}
.card:hover{border-color:var(--border2)}
.ct{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);margin-bottom:12px}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px}
.g4{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:12px}
/* timetable */
.tth{display:grid;grid-template-columns:40px repeat(7,1fr)}
.ttd{text-align:center;padding:5px 2px;font-size:10px;font-weight:600;color:var(--muted)}
.ttd.tc{color:var(--accent)}
.ttr{display:grid;grid-template-columns:40px repeat(7,1fr);border-top:1px solid var(--border);height:32px}
.ttt{font-size:9px;color:var(--muted);padding:3px 5px 0 0;text-align:right}
.ttc{border-left:1px solid var(--border);position:relative;overflow:visible}
.ttcls{position:absolute;left:2px;right:2px;border-radius:5px;padding:3px 5px;font-size:9px;font-weight:600;line-height:1.3;overflow:hidden;z-index:2;cursor:pointer}
/* items */
.ai{display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--border)}
.ai:last-child{border-bottom:none}
.sd{width:7px;height:7px;border-radius:50%;flex-shrink:0}
.dd{margin-left:auto;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700;white-space:nowrap}
/* calendar */
.cg{display:grid;grid-template-columns:repeat(7,1fr);gap:2px}
.cdh{text-align:center;font-size:9px;color:var(--muted);padding:3px;font-weight:600}
.cd{aspect-ratio:1;border-radius:6px;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding:3px;font-size:11px;cursor:pointer;transition:background .1s}
.cd:hover{background:var(--surface2)}
.cd.td{background:var(--accent);color:#fff;font-weight:700}
.cd.om{opacity:.2}
.dot{width:3px;height:3px;border-radius:50%;background:var(--accent2);margin-top:1px}
/* grades */
.gw{margin-bottom:9px}
.gl{display:flex;justify-content:space-between;font-size:11px;margin-bottom:3px}
.gt{height:5px;background:var(--surface2);border-radius:3px;overflow:hidden}
.gf{height:100%;border-radius:3px;transition:width 1s ease}
/* bookmarks */
.bmg{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
.bmi{background:var(--surface2);border:1px solid var(--border);border-radius:9px;padding:10px;cursor:pointer;transition:all .2s;text-decoration:none;display:block;position:relative}
.bmi:hover{border-color:var(--accent);transform:translateY(-2px)}
.fav{width:24px;height:24px;border-radius:5px;object-fit:contain;display:block;margin-bottom:5px}
/* people */
.pc{display:flex;align-items:center;gap:9px;padding:8px 0;border-bottom:1px solid var(--border)}
.pc:last-child{border-bottom:none}
.av{width:32px;height:32px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700}
.si{padding:8px 0;border-bottom:1px solid var(--border)}
.si:last-child{border-bottom:none}
.sh{display:flex;align-items:center;justify-content:space-between;margin-bottom:2px}
.bi{display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid var(--border)}
.bi:last-child{border-bottom:none}
.cb{width:16px;height:16px;border-radius:4px;border:2px solid var(--border2);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:9px;cursor:pointer;transition:all .15s}
.cb.dn{background:var(--success);border-color:var(--success);color:#000}
.tabs{display:flex;gap:2px;background:var(--surface2);border-radius:8px;padding:3px;margin-bottom:14px;flex-wrap:wrap}
.tab{padding:4px 11px;border-radius:6px;border:none;cursor:pointer;font-size:11px;font-weight:500;background:transparent;color:var(--muted);transition:all .1s;font-family:'Noto Sans KR',sans-serif}
.tab.on{background:var(--surface);color:var(--text)}
.sc{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:16px}
.sv{font-family:'Syne',sans-serif;font-size:28px;font-weight:700}
.sl{font-size:11px;color:var(--muted);margin-top:2px}
.ri{display:flex;align-items:center;gap:9px;padding:8px 0;border-bottom:1px solid var(--border)}
.ri:last-child{border-bottom:none}
.empty{text-align:center;padding:28px;color:var(--muted);font-size:12px}
.ei{font-size:26px;margin-bottom:6px}
.overlay{position:fixed;inset:0;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:1000;backdrop-filter:blur(4px)}
.modal{background:var(--surface);border:1px solid var(--border2);border-radius:18px;padding:24px;width:440px;max-width:92vw;max-height:88vh;overflow-y:auto}
.modal-title{font-family:'Syne',sans-serif;font-weight:700;font-size:16px;margin-bottom:18px}
.field{margin-bottom:12px}
.field label{display:block;font-size:11px;color:var(--muted);margin-bottom:4px;font-weight:500}
.field input,.field select,.field textarea{width:100%;background:var(--surface2);border:1px solid var(--border2);color:var(--text);border-radius:8px;padding:8px 10px;font-size:13px;font-family:'Noto Sans KR',sans-serif;outline:none;resize:vertical}
.field input:focus,.field select:focus,.field textarea:focus{border-color:var(--accent)}
.day-btns{display:flex;gap:4px;flex-wrap:wrap}
.day-btn{padding:4px 10px;border-radius:6px;border:1px solid var(--border2);background:transparent;color:var(--muted);font-size:12px;cursor:pointer;font-family:'Noto Sans KR',sans-serif;transition:all .1s}
.day-btn.on{background:rgba(124,106,255,0.2);border-color:var(--accent);color:var(--accent)}
.btn-row{display:flex;gap:8px;margin-top:18px}
.btn{padding:8px 16px;border-radius:8px;border:none;cursor:pointer;font-size:13px;font-weight:500;font-family:'Noto Sans KR',sans-serif;transition:all .15s}
.btn-primary{background:var(--accent);color:white;flex:1}
.btn-primary:hover{opacity:.85}
.btn-ghost{background:var(--surface2);color:var(--muted)}
.btn-ghost:hover{color:var(--text)}
.btn-danger-outline{background:rgba(255,95,122,0.12);color:var(--danger);border:1px solid rgba(255,95,122,0.3)}
.add-btn{display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:8px;border:1px dashed var(--border2);background:transparent;color:var(--muted);font-size:12px;cursor:pointer;font-family:'Noto Sans KR',sans-serif;transition:all .15s}
.add-btn:hover{border-color:var(--accent);color:var(--accent)}
.del-btn{width:22px;height:22px;border-radius:6px;border:none;background:transparent;color:var(--muted);cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.del-btn:hover{background:rgba(255,95,122,0.15);color:var(--danger)}
.edit-btn{width:22px;height:22px;border-radius:6px;border:none;background:transparent;color:var(--muted);cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.edit-btn:hover{background:rgba(124,106,255,0.15);color:var(--accent)}
.home-scroll{max-height:320px;overflow-y:auto}
.pass-badge{padding:2px 8px;border-radius:5px;font-size:10px;font-weight:700}
::-webkit-scrollbar{width:3px}
::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px}
`

function Modal({ title, onClose, children }) {
  return (
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:18}}>
          <div className="modal-title">{title}</div>
          <button className="del-btn" onClick={onClose} style={{fontSize:18}}>×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

function SelectWithEtc({ label, value, onChange, options }) {
  const isEtc = value && !options.includes(value)
  const [custom, setCustom] = useState(isEtc ? value : '')
  const displayVal = isEtc ? '기타' : value
  return (
    <div className="field">
      {label && <label>{label}</label>}
      <select value={displayVal} onChange={e=>{
        if (e.target.value==='기타') onChange('기타')
        else { onChange(e.target.value); setCustom('') }
      }}>
        {options.map(o=><option key={o}>{o}</option>)}
        <option>기타</option>
      </select>
      {displayVal==='기타' && (
        <input style={{marginTop:6}} value={custom} placeholder="직접 입력..." onChange={e=>{setCustom(e.target.value);onChange(e.target.value||'기타')}}/>
      )}
    </div>
  )
}

// ── 시간표 ────────────────────────────────────────────────────────────────────
// Fix: 시간 블록 높이를 분 단위까지 정확하게 계산 (32px = 1시간)
function timeToMinutes(t) {
  const [h, m] = (t||"0:0").split(":").map(Number)
  return h * 60 + (m||0)
}

function Timetable({ data, setData }) {
  const [showAdd, setShowAdd] = useState(false)
  const [detail, setDetail] = useState(null)
  const [form, setForm] = useState({"강의명":"","요일":[],"시작 시간":"09:00","종료 시간":"10:30","강의실":"","교수님":""})
  const PX_PER_HOUR = 32
  const START_HOUR = 8
  const END_HOUR = 23 // 22:xx까지 표시하려면 23행 필요
  const hrs = Array.from({length: END_HOUR - START_HOUR}, (_, i) => i + START_HOUR)
  const days = ["월","화","수","목","금","토","일"]
  const td = DAYS[today.getDay()]
  const cm={};let ci=0
  const cls = data.map(x=>{if(!cm[x["강의명"]])cm[x["강의명"]]=CC[ci++%CC.length];return{...x,c:cm[x["강의명"]]}})
  const toggleDay = d => setForm(f=>({...f,요일:f.요일.includes(d)?f.요일.filter(x=>x!==d):[...f.요일,d]}))

  const save = () => {
    const sh = parseInt(form["시작 시간"].split(":")[0])
    const eh = parseInt(form["종료 시간"].split(":")[0])
    if (sh < 8 || eh > 22) { alert("⚠️ 시간표는 08:00 ~ 22:00 사이만 등록 가능해요!"); return }
    if (timeToMinutes(form["종료 시간"]) <= timeToMinutes(form["시작 시간"])) { alert("⚠️ 종료 시간이 시작 시간보다 늦어야 해요!"); return }
    if (!form["강의명"] || form["요일"].length===0) { alert("강의명과 요일을 입력해주세요!"); return }
    setData(prev=>[...prev,{...form,id:newId(prev)}])
    setForm({"강의명":"","요일":[],"시작 시간":"09:00","종료 시간":"10:30","강의실":"","교수님":""})
    setShowAdd(false)
  }
  const del = id => { if(window.confirm("이 수업을 삭제할까요?")){ setData(prev=>prev.filter(x=>x.id!==id)); setDetail(null) } }

  return (
    <>
      <div className="card" style={{overflowX:'auto'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
          <div className="ct" style={{margin:0}}>🗓 시간표</div>
          <button className="add-btn" onClick={()=>setShowAdd(true)}>+ 수업 추가</button>
        </div>
        <div style={{minWidth:520}}>
          {/* 헤더 */}
          <div className="tth"><div/>{days.map(d=><div key={d} className={"ttd"+(d===td?" tc":"")}>{d}</div>)}</div>
          {/* 그리드: position:relative 컨테이너 */}
          <div style={{position:'relative'}}>
            {/* 시간 눈금 행들 */}
            {hrs.map(h=>(
              <div key={h} className="ttr">
                <div className="ttt">{h}:00</div>
                {days.map(d=><div key={d} className="ttc"/>)}
              </div>
            ))}
            {/* 강의 블록들: absolute 오버레이 */}
            {cls.map(x=>{
              const daysCols = Array.isArray(x["요일"]) ? x["요일"] : [x["요일"]||""]
              return daysCols.map(d=>{
                const dayIdx = days.indexOf(d)
                if (dayIdx < 0) return null
                const startMin = timeToMinutes(x["시작 시간"])
                const endMin = timeToMinutes(x["종료 시간"])
                const top = (startMin - START_HOUR * 60) / 60 * PX_PER_HOUR
                const height = (endMin - startMin) / 60 * PX_PER_HOUR
                // 컬럼 위치 계산: 40px(time) + dayIdx * (1/7 of remaining)
                const colWidth = `calc((100% - 40px) / 7)`
                const left = `calc(40px + ${dayIdx} * (100% - 40px) / 7 + 2px)`
                const width = `calc((100% - 40px) / 7 - 4px)`
                return (
                  <div key={x.id+d} className="ttcls" style={{
                    position:'absolute', top:top+"px", left, width, height:height+"px",
                    background:x.c.bg, borderLeft:"3px solid "+x.c.bl, color:x.c.t,
                  }} onClick={()=>setDetail(x)}>
                    <div style={{fontWeight:700}}>{x["강의명"]}</div>
                    <div style={{opacity:.7,fontSize:8}}>{x["강의실"]}</div>
                  </div>
                )
              })
            })}
          </div>
        </div>
        {data.length===0&&<div className="empty"><div className="ei">📅</div>수업을 추가해주세요</div>}
        <div style={{fontSize:10,color:'var(--muted)',marginTop:8}}>💡 수업 블록 클릭 시 상세 보기</div>
      </div>

      {detail&&(
        <Modal title="📚 수업 상세" onClose={()=>setDetail(null)}>
          <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:20}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:18}}>{detail["강의명"]}</span>
              <div style={{display:'flex',gap:4}}>{(Array.isArray(detail["요일"])?detail["요일"]:[detail["요일"]||""]).map(d=><span key={d} className="tag" style={{background:'rgba(124,106,255,0.15)',color:'var(--accent)',fontSize:11}}>{d}</span>)}</div>
            </div>
            {[["⏰ 시간",detail["시작 시간"]+" ~ "+detail["종료 시간"]],["📍 강의실",detail["강의실"]],["👨‍🏫 교수님",detail["교수님"]]].map(([k,v])=>v&&<div key={k} style={{display:'flex',gap:8,fontSize:13}}><span style={{color:'var(--muted)',minWidth:80}}>{k}</span><span style={{fontWeight:500}}>{v}</span></div>)}
          </div>
          <div className="btn-row">
            <button className="btn btn-ghost" onClick={()=>setDetail(null)}>닫기</button>
            <button className="btn btn-danger-outline" onClick={()=>del(detail.id)}>🗑 삭제</button>
          </div>
        </Modal>
      )}

      {showAdd&&(
        <Modal title="📚 수업 추가" onClose={()=>setShowAdd(false)}>
          <div className="field"><label>강의명 *</label><input value={form["강의명"]} onChange={e=>setForm(f=>({...f,"강의명":e.target.value}))} placeholder="예: 알고리즘"/></div>
          <div className="field"><label>교수님</label><input value={form["교수님"]} onChange={e=>setForm(f=>({...f,"교수님":e.target.value}))} placeholder="예: 김교수"/></div>
          <div className="field"><label>강의실</label><input value={form["강의실"]} onChange={e=>setForm(f=>({...f,"강의실":e.target.value}))} placeholder="예: 창의관 301"/></div>
          <div className="field"><label>요일 * (복수 선택)</label><div className="day-btns">{["월","화","수","목","금","토","일"].map(d=><button key={d} className={"day-btn"+(form["요일"].includes(d)?" on":"")} onClick={()=>toggleDay(d)}>{d}</button>)}</div></div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
            <div className="field"><label>시작 시간 (08:00~22:00)</label><input type="time" min="08:00" max="22:00" value={form["시작 시간"]} onChange={e=>setForm(f=>({...f,"시작 시간":e.target.value}))}/></div>
            <div className="field"><label>종료 시간 (08:00~22:00)</label><input type="time" min="08:00" max="22:00" value={form["종료 시간"]} onChange={e=>setForm(f=>({...f,"종료 시간":e.target.value}))}/></div>
          </div>
          <div className="btn-row">
            <button className="btn btn-ghost" onClick={()=>setShowAdd(false)}>취소</button>
            <button className="btn btn-primary" onClick={save}>추가</button>
          </div>
        </Modal>
      )}
    </>
  )
}

// ── 과제 트래커 ───────────────────────────────────────────────────────────────
function Assignments({ data, setData, courses }) {
  const [tab, setTab] = useState("전체")
  const [showAdd, setShowAdd] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState({"과제명":"","강의명":"","진행상황":"시작 전","제출 방법":"온라인 제출","데드라인":defaultDeadline})
  const STATUS = ["시작 전","진행 중","완료"]
  const SUBMIT = ["온라인 제출","이메일","직접 제출"]

  const isExpired = a => a["진행상황"]!=="완료" && a["데드라인"] && isPast(a["데드라인"])
  const items = data.filter(a => {
    if (tab==="기간 만료") return isExpired(a)
    if (tab==="전체") return !isExpired(a)
    return !isExpired(a) && a["진행상황"]===tab
  })
  const expiredCount = data.filter(isExpired).length
  const sc = {"시작 전":"var(--muted)","진행 중":"var(--warn)","완료":"var(--success)"}
  const ds = d=>{if(!d)return{};if(d==="D-DAY")return{background:"rgba(255,95,122,0.2)",color:"var(--danger)"};const n=parseInt(d.replace("D-",""));if(!isNaN(n)&&n<=3)return{background:"rgba(255,179,71,0.2)",color:"var(--warn)"};return{background:"var(--surface2)",color:"var(--muted)"}}

  const openAdd = () => { setForm({"과제명":"","강의명":"","진행상황":"시작 전","제출 방법":"온라인 제출","데드라인":defaultDeadline}); setEditItem(null); setShowAdd(true) }
  const openEdit = item => { setForm({...item}); setEditItem(item); setShowAdd(true) }
  const save = () => {
    if(!form["과제명"])return
    if(editItem) setData(prev=>prev.map(a=>a.id===editItem.id?{...form,id:editItem.id}:a))
    else setData(prev=>[...prev,{...form,id:newId(prev)}])
    setShowAdd(false); setEditItem(null)
  }
  const del = id=>setData(prev=>prev.filter(a=>a.id!==id))
  const updateStatus = (id,status)=>setData(prev=>prev.map(a=>a.id===id?{...a,"진행상황":status}:a))

  return (
    <>
      <div className="card">
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
          <div className="ct" style={{margin:0}}>📝 과제 트래커</div>
          <button className="add-btn" onClick={openAdd}>+ 추가</button>
        </div>
        <div className="tabs">
          {["전체","시작 전","진행 중","완료"].map(t=><button key={t} className={"tab"+(tab===t?" on":"")} onClick={()=>setTab(t)}>{t}</button>)}
          <button className={"tab"+(tab==="기간 만료"?" on":"")} onClick={()=>setTab("기간 만료")} style={expiredCount>0?{color:'var(--danger)'}:{}}>
            기간 만료{expiredCount>0&&` (${expiredCount})`}
          </button>
        </div>
        <div className="home-scroll">
          {items.length===0?<div className="empty"><div className="ei">{tab==="기간 만료"?"✅":"📝"}</div>{tab==="기간 만료"?"만료된 과제 없음":"항목 없음!"}</div>:items.map(a=>(
            <div key={a.id} className="ai">
              <div className="sd" style={{background:isExpired(a)?"var(--danger)":sc[a["진행상황"]]||"var(--muted)"}}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:500,fontSize:13,textDecoration:isExpired(a)?"line-through":""}}>{a["과제명"]}</div>
                <div style={{fontSize:10,color:"var(--muted)",marginTop:1}}>{a["강의명"]} {a["제출 방법"]&&"· "+a["제출 방법"]}</div>
              </div>
              {a["데드라인"]&&<span className="dd" style={isExpired(a)?{background:"rgba(255,95,122,0.2)",color:"var(--danger)"}:ds(dday(a["데드라인"]))}>{isExpired(a)?"만료":dday(a["데드라인"])}</span>}
              <select value={a["진행상황"]} onChange={e=>updateStatus(a.id,e.target.value)} style={{background:'var(--surface2)',border:'1px solid var(--border)',color:'var(--muted)',borderRadius:6,padding:'2px 5px',fontSize:10,cursor:'pointer'}}>
                {STATUS.map(s=><option key={s}>{s}</option>)}
              </select>
              <button className="edit-btn" onClick={()=>openEdit(a)}>✏️</button>
              <button className="del-btn" onClick={()=>del(a.id)}>×</button>
            </div>
          ))}
        </div>
      </div>
      {showAdd&&(
        <Modal title={editItem?"📝 과제 수정":"📝 과제 추가"} onClose={()=>{setShowAdd(false);setEditItem(null)}}>
          <div className="field"><label>과제명 *</label><input value={form["과제명"]} onChange={e=>setForm(f=>({...f,"과제명":e.target.value}))} placeholder="예: 알고리즘 과제 3"/></div>
          <div className="field"><label>강의</label><select value={form["강의명"]} onChange={e=>setForm(f=>({...f,"강의명":e.target.value}))}><option value="">선택 안 함</option>{courses.map(c=><option key={c.id}>{c["강의명"]}</option>)}</select></div>
          <div className="field"><label>진행상황</label><select value={form["진행상황"]} onChange={e=>setForm(f=>({...f,"진행상황":e.target.value}))}>{STATUS.map(s=><option key={s}>{s}</option>)}</select></div>
          <SelectWithEtc label="제출 방법" value={form["제출 방법"]} onChange={v=>setForm(f=>({...f,"제출 방법":v}))} options={SUBMIT}/>
          <div className="field"><label>마감일시 (기본값 23:59)</label><input type="datetime-local" value={form["데드라인"]} onChange={e=>setForm(f=>({...f,"데드라인":e.target.value}))}/></div>
          <div className="btn-row">
            <button className="btn btn-ghost" onClick={()=>{setShowAdd(false);setEditItem(null)}}>취소</button>
            <button className="btn btn-primary" onClick={save}>{editItem?"저장":"추가"}</button>
          </div>
        </Modal>
      )}
    </>
  )
}

// ── 시험 알리미 ───────────────────────────────────────────────────────────────
function Exams({ data, setData, courses }) {
  const [showAdd, setShowAdd] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState({"시험명":"","강의명":"","시험 구분":"중간고사","시험 범위":"","일시":defaultDeadline,"반복":"없음"})
  const TYPES = ["중간고사","기말고사","퀴즈"]
  const REPEAT = ["없음","매주","격주","3주마다","매달"]
  const up = data.filter(x=>x["일시"]&&new Date(x["일시"])>=today).sort((a,b)=>new Date(a["일시"])-new Date(b["일시"]))
  const tc = {"중간고사":"var(--danger)","기말고사":"var(--accent2)","퀴즈":"var(--warn)"}

  const openAdd = () => { setForm({"시험명":"","강의명":"","시험 구분":"중간고사","시험 범위":"","일시":defaultDeadline,"반복":"없음"}); setEditItem(null); setShowAdd(true) }
  const openEdit = item => { setForm({...item}); setEditItem(item); setShowAdd(true) }
  const save = () => {
    if(!form["시험명"])return
    if(form["일시"]<todayStr) { alert("⚠️ 과거 날짜에는 시험을 등록할 수 없어요!"); return }
    if(editItem) setData(prev=>prev.map(x=>x.id===editItem.id?{...form,id:editItem.id}:x))
    else setData(prev=>[...prev,{...form,id:newId(prev)}])
    setShowAdd(false); setEditItem(null)
  }
  const del = id=>setData(prev=>prev.filter(x=>x.id!==id))

  return (
    <>
      <div className="card">
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
          <div className="ct" style={{margin:0}}>📅 시험 알리미</div>
          <button className="add-btn" onClick={openAdd}>+ 추가</button>
        </div>
        <div className="home-scroll">
          {up.length===0?<div className="empty"><div className="ei">🎉</div>예정된 시험 없음</div>:up.map(x=>(
            <div key={x.id} className="ai">
              <div style={{flex:1}}>
                <div style={{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap'}}>
                  <span className="tag" style={{background:(tc[x["시험 구분"]]||"var(--muted)")+"22",color:tc[x["시험 구분"]]||"var(--muted)",fontSize:9,padding:'2px 7px'}}>{x["시험 구분"]}</span>
                  <span style={{fontWeight:500,fontSize:13}}>{x["시험명"]}</span>
                  {x["반복"]&&x["반복"]!=="없음"&&<span style={{fontSize:9,color:'var(--accent3)',background:'rgba(106,255,218,0.1)',padding:'1px 6px',borderRadius:4}}>🔁 {x["반복"]}</span>}
                </div>
                <div style={{fontSize:10,color:"var(--muted)",marginTop:2,display:'flex',gap:8}}>
                  {x["시험 범위"]&&<span>범위: {x["시험 범위"]}</span>}
                  {x["일시"]&&<span>{fmtDate(x["일시"])}</span>}
                </div>
              </div>
              <span className="dd" style={{background:"rgba(124,106,255,0.2)",color:"var(--accent)"}}>{dday(x["일시"])}</span>
              <button className="edit-btn" onClick={()=>openEdit(x)}>✏️</button>
              <button className="del-btn" onClick={()=>del(x.id)}>×</button>
            </div>
          ))}
        </div>
      </div>
      {showAdd&&(
        <Modal title={editItem?"📅 시험 수정":"📅 시험 추가"} onClose={()=>{setShowAdd(false);setEditItem(null)}}>
          <div className="field"><label>시험명 *</label><input value={form["시험명"]} onChange={e=>setForm(f=>({...f,"시험명":e.target.value}))} placeholder="예: 알고리즘 중간고사"/></div>
          <div className="field"><label>강의</label><select value={form["강의명"]} onChange={e=>setForm(f=>({...f,"강의명":e.target.value}))}><option value="">선택 안 함</option>{courses.map(c=><option key={c.id}>{c["강의명"]}</option>)}</select></div>
          <SelectWithEtc label="시험 구분" value={form["시험 구분"]} onChange={v=>setForm(f=>({...f,"시험 구분":v}))} options={TYPES}/>
          <div className="field"><label>시험 범위</label><input value={form["시험 범위"]} onChange={e=>setForm(f=>({...f,"시험 범위":e.target.value}))} placeholder="예: 1~5장"/></div>
          <div className="field"><label>일시 (오늘 이후만 가능)</label><input type="datetime-local" min={todayStr+"T00:00"} value={form["일시"]} onChange={e=>setForm(f=>({...f,"일시":e.target.value}))}/></div>
          <div className="field"><label>반복</label><select value={form["반복"]} onChange={e=>setForm(f=>({...f,"반복":e.target.value}))}>{REPEAT.map(r=><option key={r}>{r}</option>)}</select></div>
          <div className="btn-row">
            <button className="btn btn-ghost" onClick={()=>{setShowAdd(false);setEditItem(null)}}>취소</button>
            <button className="btn btn-primary" onClick={save}>{editItem?"저장":"추가"}</button>
          </div>
        </Modal>
      )}
    </>
  )
}

// ── 성적 계산기 ───────────────────────────────────────────────────────────────
function Grades({ data, setData }) {
  const [showAdd, setShowAdd] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const sems = [...new Set(data.map(i=>i["학기"]).filter(Boolean))].sort().reverse()
  const [sem, setSem] = useState(sems[0]||thisYear+"-1")
  const [form, setForm] = useState({"강의명":"","학점 수":3,"학기":sem,"취득 등급":"A"})
  const fil = data.filter(i=>i["학기"]===sem)
  const tc = fil.reduce((s,i)=>s+(Number(i["학점 수"])||0),0)
  const ws = fil.reduce((s,i)=>{const g=gpa(i["취득 등급"]);return s+(g!==null?g*(Number(i["학점 수"])||0):0)},0)
  const avg = tc>0?(ws/tc).toFixed(2):"-"
  const openEdit = item=>{setForm({...item});setEditItem(item);setShowAdd(true)}
  const save = ()=>{
    if(!form["강의명"])return
    if(editItem)setData(prev=>prev.map(x=>x.id===editItem.id?{...form,id:editItem.id}:x))
    else setData(prev=>[...prev,{...form,id:newId(prev)}])
    setShowAdd(false);setEditItem(null)
  }
  const del = id=>setData(prev=>prev.filter(x=>x.id!==id))
  return (
    <>
      <div className="card">
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
          <div className="ct" style={{margin:0}}>📊 성적 계산기</div>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <select value={sem} onChange={e=>setSem(e.target.value)} style={{background:'var(--surface2)',border:'1px solid var(--border)',color:'var(--text)',borderRadius:7,padding:'3px 7px',fontSize:10}}>{sems.map(s=><option key={s}>{s}</option>)}</select>
            <button className="add-btn" onClick={()=>{setForm({"강의명":"","학점 수":3,"학기":sem,"취득 등급":"A"});setEditItem(null);setShowAdd(true)}}>+ 추가</button>
          </div>
        </div>
        <div style={{display:'flex',alignItems:'baseline',gap:6,marginBottom:16}}>
          <span style={{fontFamily:'Syne',fontWeight:800,fontSize:34,color:'var(--accent)'}}>{avg}</span>
          <span style={{color:'var(--muted)',fontSize:11}}>/ 4.5 · {tc}학점</span>
        </div>
        {fil.map(c=>{const g=gpa(c["취득 등급"]);const pct=g!==null?(g/4.5*100):0;const bc=g>=4.0?"var(--success)":g>=3.0?"var(--accent)":g>=2.0?"var(--warn)":"var(--danger)";return(
          <div key={c.id} className="gw" style={{display:'flex',alignItems:'center',gap:8}}>
            <div style={{flex:1}}>
              <div className="gl"><span>{c["강의명"]} <span style={{color:'var(--muted)',fontSize:10}}>({c["학점 수"]}학점)</span></span><span style={{fontWeight:700,color:bc}}>{c["취득 등급"]||"—"}</span></div>
              <div className="gt"><div className="gf" style={{width:pct+"%",background:bc}}/></div>
            </div>
            <button className="edit-btn" onClick={()=>openEdit(c)}>✏️</button>
            <button className="del-btn" onClick={()=>del(c.id)}>×</button>
          </div>
        )})}
        {fil.length===0&&<div className="empty"><div className="ei">📊</div>성적을 추가해주세요</div>}
      </div>
      {showAdd&&(
        <Modal title={editItem?"📊 성적 수정":"📊 성적 추가"} onClose={()=>{setShowAdd(false);setEditItem(null)}}>
          <div className="field"><label>강의명 *</label><input value={form["강의명"]} onChange={e=>setForm(f=>({...f,"강의명":e.target.value}))} placeholder="예: 알고리즘"/></div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
            <div className="field"><label>학점 수</label><input type="number" min="1" max="6" value={form["학점 수"]} onChange={e=>setForm(f=>({...f,"학점 수":Number(e.target.value)}))}/></div>
            <div className="field"><label>학기</label><input value={form["학기"]} onChange={e=>setForm(f=>({...f,"학기":e.target.value}))} placeholder={thisYear+"-1"}/></div>
          </div>
          <div className="field"><label>취득 등급</label><select value={form["취득 등급"]} onChange={e=>setForm(f=>({...f,"취득 등급":e.target.value}))}>{["A+","A","B+","B","C+","C","D+","D","F"].map(g=><option key={g}>{g}</option>)}</select></div>
          <div className="btn-row">
            <button className="btn btn-ghost" onClick={()=>{setShowAdd(false);setEditItem(null)}}>취소</button>
            <button className="btn btn-primary" onClick={save}>{editItem?"저장":"추가"}</button>
          </div>
        </Modal>
      )}
    </>
  )
}

// ── 북마크 (Google Favicon API) ───────────────────────────────────────────────
function FavIcon({ url, name }) {
  const [err, setErr] = useState(false)
  const src = getFavicon(url)
  if (!src || err) return <span style={{fontSize:20,display:'block',marginBottom:5}}>🌐</span>
  return <img src={src} className="fav" onError={()=>setErr(true)} alt={name}/>
}

function Bookmarks({ data, setData }) {
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({"사이트명":"","URL":"","카테고리":"커스텀"})
  const save = ()=>{
    if(!form["사이트명"]||!form["URL"])return
    const url = form["URL"].startsWith("http") ? form["URL"] : "https://"+form["URL"]
    setData(prev=>[...prev,{...form,"URL":url,id:newId(prev)}])
    setForm({"사이트명":"","URL":"","카테고리":"커스텀"})
    setShowAdd(false)
  }
  const del=(e,id)=>{e.preventDefault();e.stopPropagation();setData(prev=>prev.filter(x=>x.id!==id))}
  return (
    <>
      <div className="card">
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
          <div className="ct" style={{margin:0}}>🔗 사이트 바로가기</div>
          <button className="add-btn" onClick={()=>setShowAdd(true)}>+ 추가</button>
        </div>
        <div className="bmg">
          {data.map(b=>(
            <a key={b.id} href={b["URL"]||"#"} target="_blank" rel="noreferrer" className="bmi">
              <button className="del-btn" onClick={e=>del(e,b.id)} style={{position:'absolute',top:4,right:4,opacity:.5}}>×</button>
              <FavIcon url={b["URL"]} name={b["사이트명"]}/>
              <div style={{fontSize:11,fontWeight:500,color:'var(--text)'}}>{b["사이트명"]}</div>
              <div style={{fontSize:9,color:'var(--muted)',marginTop:1}}>{b["카테고리"]||""}</div>
            </a>
          ))}
        </div>
      </div>
      {showAdd&&(
        <Modal title="🔗 북마크 추가" onClose={()=>setShowAdd(false)}>
          <div className="field"><label>사이트명 *</label><input value={form["사이트명"]} onChange={e=>setForm(f=>({...f,"사이트명":e.target.value}))} placeholder="예: GitHub"/></div>
          <div className="field"><label>URL *</label><input value={form["URL"]} onChange={e=>setForm(f=>({...f,"URL":e.target.value}))} placeholder="예: github.com"/></div>
          <div className="field"><label>카테고리</label><select value={form["카테고리"]} onChange={e=>setForm(f=>({...f,"카테고리":e.target.value}))}>{["기본","학교","수강신청","커스텀"].map(c=><option key={c}>{c}</option>)}</select></div>
          <div className="btn-row">
            <button className="btn btn-ghost" onClick={()=>setShowAdd(false)}>취소</button>
            <button className="btn btn-primary" onClick={save}>추가</button>
          </div>
        </Modal>
      )}
    </>
  )
}

// ── 캘린더 ────────────────────────────────────────────────────────────────────
function Calendar({ assignments, exams }) {
  const [cur, setCur] = useState(new Date(today.getFullYear(),today.getMonth(),1))
  const yr=cur.getFullYear(),mo=cur.getMonth()
  const fd=new Date(yr,mo,1).getDay(),dim=new Date(yr,mo+1,0).getDate(),dipm=new Date(yr,mo,0).getDate()
  const evts=new Set([...assignments.map(a=>a["데드라인"]||""),...exams.map(x=>x["일시"]||"")].map(s=>s.slice(0,10)).filter(Boolean))
  const cells=[]
  for(let i=0;i<fd;i++)cells.push({d:dipm-fd+1+i,c:false})
  for(let i=1;i<=dim;i++)cells.push({d:i,c:true})
  while(cells.length%7!==0)cells.push({d:cells.length-dim-fd+1,c:false})
  return (
    <div className="card" style={{alignSelf:'start'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
        <div className="ct" style={{margin:0}}>📆 캘린더</div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <button onClick={()=>setCur(new Date(yr,mo-1,1))} style={{background:'none',border:'none',cursor:'pointer',color:'var(--muted)',fontSize:14}}>‹</button>
          <span style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:12}}>{yr}년 {MONTHS[mo]}</span>
          <button onClick={()=>setCur(new Date(yr,mo+1,1))} style={{background:'none',border:'none',cursor:'pointer',color:'var(--muted)',fontSize:14}}>›</button>
        </div>
      </div>
      <div className="cg">
        {["일","월","화","수","목","금","토"].map(d=><div key={d} className="cdh" style={{color:d==="일"?"var(--danger)":d==="토"?"var(--accent)":"var(--muted)"}}>{d}</div>)}
        {cells.map((c,i)=>{const ds=c.c?(yr+"-"+String(mo+1).padStart(2,"0")+"-"+String(c.d).padStart(2,"0")):"";const isTd=c.c&&c.d===today.getDate()&&mo===today.getMonth()&&yr===today.getFullYear();return<div key={i} className={"cd"+(isTd?" td":"")+(!c.c?" om":"")}>{c.d}{evts.has(ds)&&!isTd&&<div className="dot"/>}</div>})}
      </div>
    </div>
  )
}

// ── 스펙 관리 ─────────────────────────────────────────────────────────────────
// 카테고리: 공인 시험 / 자격증 / 수상 기록 / 기타
// 동아리 없음
// 상태 없음 → 만료 기간으로 대체 (없으면 표시 안 함)
// 점수 + pass/fail 동시 입력 가능
function Specs({ data, setData }) {
  const [showAdd, setShowAdd] = useState(false)
  const [editItem, setEditItem] = useState(null)
  // 카테고리별 필드 설정
  // 공인 시험 / 자격증: 점수, pass/fail, 만료기간
  // 수상 기록: 수상 내용, 주최기관, 수상날짜 (만료없음)
  // 기타: 점수, pass/fail, 만료기간
  const CATS = ["공인 시험","자격증","수상 기록"]
  const PASS_FAIL = ["","Pass","Fail","대기 중"]

  const emptyForm = {"스펙명":"","카테고리":"공인 시험","현재 점수":"","목표 점수":"","pass_fail":"","만료일":"","수상 내용":"","주최 기관":"","수상 날짜":"","메모":""}
  const [form, setForm] = useState(emptyForm)

  const isCert = ["공인 시험","자격증"].includes(form["카테고리"]) || (!CATS.includes(form["카테고리"]))
  const isAward = form["카테고리"]==="수상 기록"

  // D-day for expiry
  const expiryBadge = (d) => {
    if (!d) return null
    const diff = Math.ceil((new Date(d) - today) / 86400000)
    if (diff < 0) return {label:"만료됨", color:"var(--danger)"}
    if (diff <= 90) return {label:`만료 ${diff}일 전`, color:"var(--warn)"}
    return {label:fmtDate(d)+" 까지", color:"var(--muted)"}
  }

  const openEdit = item=>{setForm({...emptyForm,...item});setEditItem(item);setShowAdd(true)}
  const save = ()=>{
    if(!form["스펙명"])return
    if(editItem)setData(prev=>prev.map(x=>x.id===editItem.id?{...form,id:editItem.id}:x))
    else setData(prev=>[...prev,{...form,id:newId(prev)}])
    setShowAdd(false);setEditItem(null)
  }
  const del = id=>setData(prev=>prev.filter(x=>x.id!==id))

  return (
    <>
      <div className="card">
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
          <div className="ct" style={{margin:0}}>🏆 스펙 관리</div>
          <button className="add-btn" onClick={()=>{setForm(emptyForm);setEditItem(null);setShowAdd(true)}}>+ 추가</button>
        </div>
        {data.map(s=>{
          const exp = expiryBadge(s["만료일"])
          const isCertItem = s["카테고리"]!=="수상 기록"
          return (
            <div key={s.id} className="si">
              <div className="sh">
                <div style={{display:'flex',alignItems:'center',gap:6}}>
                  <span style={{fontSize:12,fontWeight:500}}>{s["스펙명"]}</span>
                  <span className="tag" style={{background:'rgba(124,106,255,0.12)',color:'var(--muted)',fontSize:9,padding:'1px 6px'}}>{s["카테고리"]}</span>
                </div>
                <div style={{display:'flex',gap:6,alignItems:'center'}}>
                  <button className="edit-btn" onClick={()=>openEdit(s)}>✏️</button>
                  <button className="del-btn" onClick={()=>del(s.id)}>×</button>
                </div>
              </div>
              <div style={{fontSize:10,color:'var(--muted)',display:'flex',gap:8,flexWrap:'wrap',marginTop:3,alignItems:'center'}}>
                {/* 공인시험/자격증/기타: 점수 + pass/fail */}
                {isCertItem&&s["현재 점수"]&&<span>현재: {s["현재 점수"]}</span>}
                {isCertItem&&s["목표 점수"]&&<span>목표: {s["목표 점수"]}</span>}
                {isCertItem&&s["pass_fail"]&&(
                  <span className="pass-badge" style={{background:s["pass_fail"]==="Pass"?"rgba(77,255,180,0.15)":s["pass_fail"]==="Fail"?"rgba(255,95,122,0.15)":"rgba(255,179,71,0.15)",color:s["pass_fail"]==="Pass"?"var(--success)":s["pass_fail"]==="Fail"?"var(--danger)":"var(--warn)"}}>
                    {s["pass_fail"]}
                  </span>
                )}
                {/* 수상기록 */}
                {!isCertItem&&s["수상 내용"]&&<span>🏅 {s["수상 내용"]}</span>}
                {!isCertItem&&s["주최 기관"]&&<span>주최: {s["주최 기관"]}</span>}
                {!isCertItem&&s["수상 날짜"]&&<span>{fmtDate(s["수상 날짜"])}</span>}
                {/* 만료일 */}
                {exp&&<span style={{color:exp.color,fontWeight:500}}>{exp.label}</span>}
              </div>
              {s["메모"]&&<div style={{fontSize:10,color:'var(--muted)',marginTop:3}}>{s["메모"]}</div>}
            </div>
          )
        })}
        {data.length===0&&<div className="empty"><div className="ei">🏆</div>스펙을 추가해주세요</div>}
      </div>

      {showAdd&&(
        <Modal title={editItem?"🏆 스펙 수정":"🏆 스펙 추가"} onClose={()=>{setShowAdd(false);setEditItem(null)}}>
          <div className="field"><label>스펙명 *</label><input value={form["스펙명"]} onChange={e=>setForm(f=>({...f,"스펙명":e.target.value}))} placeholder="예: TOEIC"/></div>
          <SelectWithEtc label="카테고리" value={form["카테고리"]} onChange={v=>setForm(f=>({...f,"카테고리":v}))} options={CATS}/>

          {isCert&&<>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
              <div className="field"><label>현재 점수/등급</label><input value={form["현재 점수"]} onChange={e=>setForm(f=>({...f,"현재 점수":e.target.value}))} placeholder="예: 820"/></div>
              <div className="field"><label>목표 점수/등급</label><input value={form["목표 점수"]} onChange={e=>setForm(f=>({...f,"목표 점수":e.target.value}))} placeholder="예: 900"/></div>
            </div>
            <div className="field"><label>Pass / Fail</label>
              <select value={form["pass_fail"]} onChange={e=>setForm(f=>({...f,"pass_fail":e.target.value}))}>
                {PASS_FAIL.map(p=><option key={p} value={p}>{p||"미정"}</option>)}
              </select>
            </div>
            <div className="field">
              <label>만료일 (없으면 비워두기)</label>
              <input type="date" value={form["만료일"]} onChange={e=>setForm(f=>({...f,"만료일":e.target.value}))}/>
            </div>
          </>}

          {isAward&&<>
            <div className="field"><label>수상 내용</label><input value={form["수상 내용"]} onChange={e=>setForm(f=>({...f,"수상 내용":e.target.value}))} placeholder="예: 최우수상 / 장려상 / 입선"/></div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
              <div className="field"><label>주최 기관</label><input value={form["주최 기관"]} onChange={e=>setForm(f=>({...f,"주최 기관":e.target.value}))} placeholder="예: 과기부"/></div>
              <div className="field"><label>수상 날짜</label><input type="date" value={form["수상 날짜"]} onChange={e=>setForm(f=>({...f,"수상 날짜":e.target.value}))}/></div>
            </div>
          </>}

          <div className="field"><label>메모</label><textarea rows={2} value={form["메모"]} onChange={e=>setForm(f=>({...f,"메모":e.target.value}))} placeholder="추가 메모..."/></div>
          <div className="btn-row">
            <button className="btn btn-ghost" onClick={()=>{setShowAdd(false);setEditItem(null)}}>취소</button>
            <button className="btn btn-primary" onClick={save}>{editItem?"저장":"추가"}</button>
          </div>
        </Modal>
      )}
    </>
  )
}

// ── 인간 정보 ─────────────────────────────────────────────────────────────────
function People({ data, setData }) {
  const [showAdd, setShowAdd] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const TYPES = ["교수님","조교","친구","팀플 팀원"]
  const [form, setForm] = useState({"이름":"","구분":"교수님","이메일":"","전화번호":"","위치":"","메모":""})
  const ac = ["var(--accent)","var(--accent2)","var(--accent3)","var(--warn)","var(--success)"]
  const openEdit = item=>{setForm({...item});setEditItem(item);setShowAdd(true)}
  const save = ()=>{
    if(!form["이름"])return
    if(editItem)setData(prev=>prev.map(x=>x.id===editItem.id?{...form,id:editItem.id}:x))
    else setData(prev=>[...prev,{...form,id:newId(prev)}])
    setShowAdd(false);setEditItem(null)
  }
  const del = id=>setData(prev=>prev.filter(x=>x.id!==id))
  return (
    <>
      <div className="card">
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
          <div className="ct" style={{margin:0}}>👥 인간 정보</div>
          <button className="add-btn" onClick={()=>{setForm({"이름":"","구분":"교수님","이메일":"","전화번호":"","위치":"","메모":""});setEditItem(null);setShowAdd(true)}}>+ 추가</button>
        </div>
        {data.map((p,i)=>(
          <div key={p.id} className="pc">
            <div className="av" style={{background:ac[i%ac.length]+"25",color:ac[i%ac.length]}}>{(p["이름"]||"?")[0]}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12,fontWeight:500}}>{p["이름"]}</div>
              <div style={{fontSize:10,color:'var(--muted)'}}>{p["구분"]}{p["이메일"]?" · "+p["이메일"]:""}{p["위치"]?" · "+p["위치"]:""}</div>
              {p["메모"]&&<div style={{fontSize:10,color:'var(--muted)',marginTop:1}}>{p["메모"]}</div>}
            </div>
            <button className="edit-btn" onClick={()=>openEdit(p)}>✏️</button>
            <button className="del-btn" onClick={()=>del(p.id)}>×</button>
          </div>
        ))}
        {data.length===0&&<div className="empty"><div className="ei">👥</div>연락처를 추가해주세요</div>}
      </div>
      {showAdd&&(
        <Modal title={editItem?"👥 정보 수정":"👥 인물 추가"} onClose={()=>{setShowAdd(false);setEditItem(null)}}>
          <div className="field"><label>이름 *</label><input value={form["이름"]} onChange={e=>setForm(f=>({...f,"이름":e.target.value}))} placeholder="예: 김○○ 교수님"/></div>
          <SelectWithEtc label="구분" value={form["구분"]} onChange={v=>setForm(f=>({...f,"구분":v}))} options={TYPES}/>
          <div className="field"><label>이메일</label><input type="email" value={form["이메일"]} onChange={e=>setForm(f=>({...f,"이메일":e.target.value}))} placeholder="example@seoultech.ac.kr"/></div>
          <div className="field"><label>전화번호</label><input value={form["전화번호"]} onChange={e=>setForm(f=>({...f,"전화번호":e.target.value}))} placeholder="010-0000-0000"/></div>
          <div className="field"><label>위치 (강의실 등)</label><input value={form["위치"]} onChange={e=>setForm(f=>({...f,"위치":e.target.value}))} placeholder="창의관 514"/></div>
          <div className="field"><label>메모</label><textarea rows={2} value={form["메모"]} onChange={e=>setForm(f=>({...f,"메모":e.target.value}))} placeholder="면담 가능 시간 등..."/></div>
          <div className="btn-row">
            <button className="btn btn-ghost" onClick={()=>{setShowAdd(false);setEditItem(null)}}>취소</button>
            <button className="btn btn-primary" onClick={save}>{editItem?"저장":"추가"}</button>
          </div>
        </Modal>
      )}
    </>
  )
}

// ── 나만의 기록장 ─────────────────────────────────────────────────────────────
function Records({ data, setData }) {
  const [cat, setCat] = useState("전체")
  const [showAdd, setShowAdd] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const CATS = ["🍜 맛집","📖 책","🎬 영화","📹 영상","🛍 제품"]
  const STARS = ["⭐","⭐⭐","⭐⭐⭐","⭐⭐⭐⭐","⭐⭐⭐⭐⭐"]
  const [form, setForm] = useState({"제목":"","카테고리":"🍜 맛집","별점":"⭐⭐⭐","한줄 감상":"","링크":"","메모":""})
  const fil = data.filter(r=>cat==="전체"||r["카테고리"]===cat)
  const openEdit = item=>{setForm({...item});setEditItem(item);setShowAdd(true)}
  const save = ()=>{
    if(!form["제목"])return
    if(editItem)setData(prev=>prev.map(x=>x.id===editItem.id?{...form,id:editItem.id}:x))
    else setData(prev=>[...prev,{...form,id:newId(prev)}])
    setShowAdd(false);setEditItem(null)
  }
  const del = id=>setData(prev=>prev.filter(x=>x.id!==id))
  return (
    <>
      <div className="card">
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
          <div className="ct" style={{margin:0}}>📚 나만의 기록장</div>
          <button className="add-btn" onClick={()=>{setForm({"제목":"","카테고리":"🍜 맛집","별점":"⭐⭐⭐","한줄 감상":"","링크":"","메모":""});setEditItem(null);setShowAdd(true)}}>+ 추가</button>
        </div>
        <div className="tabs">{["전체",...CATS].map(c=><button key={c} className={"tab"+(cat===c?" on":"")} onClick={()=>setCat(c)}>{c}</button>)}</div>
        {fil.map(r=>(
          <div key={r.id} className="ri">
            <span style={{fontSize:15}}>{(r["카테고리"]||"").split(" ")[0]||"📌"}</span>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12,fontWeight:500}}>{r["제목"]}</div>
              {r["한줄 감상"]&&<div style={{fontSize:10,color:'var(--muted)'}}>{r["한줄 감상"]}</div>}
            </div>
            <div style={{color:'#ffb347',fontSize:10}}>{r["별점"]||""}</div>
            <button className="edit-btn" onClick={()=>openEdit(r)}>✏️</button>
            <button className="del-btn" onClick={()=>del(r.id)}>×</button>
          </div>
        ))}
        {fil.length===0&&<div className="empty"><div className="ei">📚</div>기록을 추가해주세요</div>}
      </div>
      {showAdd&&(
        <Modal title={editItem?"📚 기록 수정":"📚 기록 추가"} onClose={()=>{setShowAdd(false);setEditItem(null)}}>
          <div className="field"><label>제목 *</label><input value={form["제목"]} onChange={e=>setForm(f=>({...f,"제목":e.target.value}))} placeholder="예: 인터스텔라"/></div>
          <SelectWithEtc label="카테고리" value={form["카테고리"]} onChange={v=>setForm(f=>({...f,"카테고리":v}))} options={CATS}/>
          <div className="field"><label>별점</label><select value={form["별점"]} onChange={e=>setForm(f=>({...f,"별점":e.target.value}))}>{STARS.map(s=><option key={s}>{s}</option>)}</select></div>
          <div className="field"><label>한줄 감상</label><input value={form["한줄 감상"]} onChange={e=>setForm(f=>({...f,"한줄 감상":e.target.value}))} placeholder="예: 역대급 SF"/></div>
          <div className="field"><label>링크 (URL)</label><input value={form["링크"]} onChange={e=>setForm(f=>({...f,"링크":e.target.value}))} placeholder="https://..."/></div>
          <div className="field"><label>상세 메모</label><textarea rows={2} value={form["메모"]} onChange={e=>setForm(f=>({...f,"메모":e.target.value}))} placeholder="추가 메모..."/></div>
          <div className="btn-row">
            <button className="btn btn-ghost" onClick={()=>{setShowAdd(false);setEditItem(null)}}>취소</button>
            <button className="btn btn-primary" onClick={save}>{editItem?"저장":"추가"}</button>
          </div>
        </Modal>
      )}
    </>
  )
}

// ── 버킷리스트 ────────────────────────────────────────────────────────────────
function Bucket({ data, setData }) {
  const [showAdd, setShowAdd] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const SEASONS = ["1학기","여름방학","2학기","겨울방학","재학 중","졸업 전"]
  const CATS = ["여행","경험","학습","스펙","관계"]
  const [form, setForm] = useState({"항목":"","카테고리":"경험","시즌":"재학 중","완료":false,"메모":""})
  const done = data.filter(b=>b["완료"]).length
  const toggle = id=>setData(prev=>prev.map(b=>b.id===id?{...b,완료:!b["완료"]}:b))
  const openEdit = item=>{setForm({...item});setEditItem(item);setShowAdd(true)}
  const save = ()=>{
    if(!form["항목"])return
    if(editItem)setData(prev=>prev.map(x=>x.id===editItem.id?{...form,id:editItem.id}:x))
    else setData(prev=>[...prev,{...form,id:newId(prev)}])
    setShowAdd(false);setEditItem(null)
  }
  const del = id=>setData(prev=>prev.filter(x=>x.id!==id))
  return (
    <>
      <div className="card">
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
          <div className="ct" style={{margin:0}}>🪣 버킷리스트</div>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <span style={{fontSize:10,color:'var(--muted)'}}>{done}/{data.length} 완료</span>
            <button className="add-btn" onClick={()=>{setForm({"항목":"","카테고리":"경험","시즌":"재학 중","완료":false,"메모":""});setEditItem(null);setShowAdd(true)}}>+ 추가</button>
          </div>
        </div>
        <div style={{height:4,background:'var(--surface2)',borderRadius:2,marginBottom:12,overflow:'hidden'}}>
          <div style={{height:'100%',width:(data.length>0?done/data.length*100:0)+"%",background:'var(--success)',borderRadius:2,transition:'width 0.5s'}}/>
        </div>
        {data.map(b=>(
          <div key={b.id} className="bi">
            <div className={"cb"+(b["완료"]?" dn":"")} onClick={()=>toggle(b.id)}>{b["완료"]&&"✓"}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:12,fontWeight:500,textDecoration:b["완료"]?"line-through":"none",opacity:b["완료"]?0.5:1}}>{b["항목"]}</div>
              <div style={{fontSize:10,color:'var(--muted)',display:'flex',gap:6}}>{b["시즌"]&&<span>{b["시즌"]}</span>}{b["카테고리"]&&<span>· {b["카테고리"]}</span>}</div>
            </div>
            <button className="edit-btn" onClick={()=>openEdit(b)}>✏️</button>
            <button className="del-btn" onClick={()=>del(b.id)}>×</button>
          </div>
        ))}
        {data.length===0&&<div className="empty"><div className="ei">🪣</div>버킷리스트를 채워보세요</div>}
      </div>
      {showAdd&&(
        <Modal title={editItem?"🪣 버킷 수정":"🪣 버킷 추가"} onClose={()=>{setShowAdd(false);setEditItem(null)}}>
          <div className="field"><label>항목 *</label><input value={form["항목"]} onChange={e=>setForm(f=>({...f,"항목":e.target.value}))} placeholder="예: 교환학생 가기"/></div>
          <SelectWithEtc label="카테고리" value={form["카테고리"]} onChange={v=>setForm(f=>({...f,"카테고리":v}))} options={CATS}/>
          <div className="field"><label>시즌</label><select value={form["시즌"]} onChange={e=>setForm(f=>({...f,"시즌":e.target.value}))}>{SEASONS.map(s=><option key={s}>{s}</option>)}</select></div>
          <div className="field"><label>메모</label><textarea rows={2} value={form["메모"]} onChange={e=>setForm(f=>({...f,"메모":e.target.value}))} placeholder="추가 메모..."/></div>
          <div className="btn-row">
            <button className="btn btn-ghost" onClick={()=>{setShowAdd(false);setEditItem(null)}}>취소</button>
            <button className="btn btn-primary" onClick={save}>{editItem?"저장":"추가"}</button>
          </div>
        </Modal>
      )}
    </>
  )
}

// ── 팀플 아카이브 ─────────────────────────────────────────────────────────────
function Teamwork({ data, setData }) {
  const [showAdd, setShowAdd] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const STATUS = ["준비","진행 중","완료"]
  const [form, setForm] = useState({"프로젝트명":"","상태":"진행 중","내 역할":"","마감일":"","팀원":"","메모":""})
  const sc = {"준비":"var(--muted)","진행 중":"var(--warn)","완료":"var(--success)"}
  const openEdit = item=>{setForm({...item});setEditItem(item);setShowAdd(true)}
  const save = ()=>{
    if(!form["프로젝트명"])return
    if(editItem)setData(prev=>prev.map(x=>x.id===editItem.id?{...form,id:editItem.id}:x))
    else setData(prev=>[...prev,{...form,id:newId(prev)}])
    setShowAdd(false);setEditItem(null)
  }
  const del = id=>setData(prev=>prev.filter(x=>x.id!==id))
  return (
    <>
      <div className="card">
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
          <div className="ct" style={{margin:0}}>🤝 팀플 아카이브</div>
          <button className="add-btn" onClick={()=>{setForm({"프로젝트명":"","상태":"진행 중","내 역할":"","마감일":"","팀원":"","메모":""});setEditItem(null);setShowAdd(true)}}>+ 추가</button>
        </div>
        {data.map(t=>(
          <div key={t.id} className="ai">
            <div style={{flex:1}}>
              <div style={{fontWeight:500,fontSize:12}}>{t["프로젝트명"]}</div>
              <div style={{fontSize:10,color:'var(--muted)',display:'flex',gap:6}}>{t["내 역할"]&&<span>내 역할: {t["내 역할"]}</span>}{t["팀원"]&&<span>· {t["팀원"]}</span>}</div>
              {t["마감일"]&&<div style={{fontSize:10,color:'var(--muted)',marginTop:1}}>마감: {fmtDate(t["마감일"])}</div>}
            </div>
            {t["상태"]&&<span className="tag" style={{background:(sc[t["상태"]])+"22",color:sc[t["상태"]],fontSize:10,padding:'2px 8px'}}>{t["상태"]}</span>}
            {t["마감일"]&&<span className="dd" style={{background:'var(--surface2)',color:'var(--muted)'}}>{dday(t["마감일"])}</span>}
            <button className="edit-btn" onClick={()=>openEdit(t)}>✏️</button>
            <button className="del-btn" onClick={()=>del(t.id)}>×</button>
          </div>
        ))}
        {data.length===0&&<div className="empty"><div className="ei">🤝</div>팀플을 추가해주세요</div>}
      </div>
      {showAdd&&(
        <Modal title={editItem?"🤝 팀플 수정":"🤝 팀플 추가"} onClose={()=>{setShowAdd(false);setEditItem(null)}}>
          <div className="field"><label>프로젝트명 *</label><input value={form["프로젝트명"]} onChange={e=>setForm(f=>({...f,"프로젝트명":e.target.value}))} placeholder="예: 캡스톤 디자인"/></div>
          <div className="field"><label>상태</label><select value={form["상태"]} onChange={e=>setForm(f=>({...f,"상태":e.target.value}))}>{STATUS.map(s=><option key={s}>{s}</option>)}</select></div>
          <div className="field"><label>내 역할</label><input value={form["내 역할"]} onChange={e=>setForm(f=>({...f,"내 역할":e.target.value}))} placeholder="예: 백엔드 개발"/></div>
          <div className="field"><label>팀원</label><input value={form["팀원"]} onChange={e=>setForm(f=>({...f,"팀원":e.target.value}))} placeholder="예: 김철수, 이영희"/></div>
          <div className="field"><label>마감일</label><input type="date" value={form["마감일"]} onChange={e=>setForm(f=>({...f,"마감일":e.target.value}))}/></div>
          <div className="field"><label>메모</label><textarea rows={2} value={form["메모"]} onChange={e=>setForm(f=>({...f,"메모":e.target.value}))} placeholder="자료 링크, 회의록 등..."/></div>
          <div className="btn-row">
            <button className="btn btn-ghost" onClick={()=>{setShowAdd(false);setEditItem(null)}}>취소</button>
            <button className="btn btn-primary" onClick={save}>{editItem?"저장":"추가"}</button>
          </div>
        </Modal>
      )}
    </>
  )
}

// ── 메인 ──────────────────────────────────────────────────────────────────────
const VIEWS=[
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
  const [view,setView]=useState("home")
  const [timetable,setTimetable]=useStorage("tt",INIT.timetable)
  const [assignments,setAssignments]=useStorage("asgn",INIT.assignments)
  const [exams,setExams]=useStorage("exams",INIT.exams)
  const [grades,setGrades]=useStorage("grades",INIT.grades)
  const [bookmarks,setBookmarks]=useStorage("bmarks",INIT.bookmarks)
  const [specs,setSpecs]=useStorage("specs",INIT.specs)
  const [people,setPeople]=useStorage("people",INIT.people)
  const [records,setRecords]=useStorage("records",INIT.records)
  const [buckets,setBuckets]=useStorage("buckets",INIT.buckets)
  const [teamwork,setTeamwork]=useStorage("teamwork",INIT.teamwork)

  const urgent=assignments.filter(a=>{const d=a["데드라인"];if(!d)return false;const df=Math.ceil((new Date(d)-today)/86400000);return df>=0&&df<=3&&a["진행상황"]!=="완료"})
  const upEx=exams.filter(x=>x["일시"]&&new Date(x["일시"])>=today).length
  const expired=assignments.filter(a=>a["진행상황"]!=="완료"&&a["데드라인"]&&isPast(a["데드라인"])).length
  const v=VIEWS.find(x=>x.id===view)

  return (
    <>
      <style>{CSS}</style>
      <div className="layout">
        <nav className="sidebar">
          <div className="logo">서T</div>
          {VIEWS.map(v=><button key={v.id} className={"nb"+(view===v.id?" on":"")} onClick={()=>setView(v.id)}>{v.icon}<span className="tip">{v.label}</span></button>)}
        </nav>
        <main className="main">
          <div className="hdr">
            <div>
              <div className="htitle">{v.icon} {v.label}</div>
              <div className="hdate">{thisYear}년 {MONTHS[today.getMonth()]} {today.getDate()}일 {DAYS[today.getDay()]}요일</div>
            </div>
            <div style={{display:'flex',gap:6}}>
              {urgent.length>0&&<span className="tag" style={{background:'rgba(255,179,71,0.15)',color:'var(--warn)'}}>⚠️ 마감 임박 {urgent.length}개</span>}
              {expired>0&&<span className="tag" style={{background:'rgba(255,95,122,0.15)',color:'var(--danger)'}}>🚨 기간 만료 {expired}개</span>}
              {upEx>0&&<span className="tag" style={{background:'rgba(124,106,255,0.15)',color:'var(--accent)'}}>📝 예정 시험 {upEx}개</span>}
            </div>
          </div>

          {view==="home"&&<>
            <div className="g4">
              <div className="sc"><div className="sv" style={{color:'var(--warn)'}}>{urgent.length}</div><div className="sl">마감 임박 과제</div></div>
              <div className="sc"><div className="sv" style={{color:'var(--danger)'}}>{expired}</div><div className="sl">기간 만료</div></div>
              <div className="sc"><div className="sv" style={{color:'var(--accent)'}}>{assignments.filter(a=>a["진행상황"]==="진행 중").length}</div><div className="sl">진행 중 과제</div></div>
              <div className="sc"><div className="sv" style={{color:'var(--success)'}}>{upEx}</div><div className="sl">예정된 시험</div></div>
            </div>
            <div className="g2">
              <Calendar assignments={assignments} exams={exams}/>
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                <Assignments data={assignments} setData={setAssignments} courses={timetable}/>
                <Exams data={exams} setData={setExams} courses={timetable}/>
              </div>
            </div>
            <Bookmarks data={bookmarks} setData={setBookmarks}/>
          </>}
          {view==="schedule"&&<Timetable data={timetable} setData={setTimetable}/>}
          {view==="todo"&&<div className="g2"><Assignments data={assignments} setData={setAssignments} courses={timetable}/><Exams data={exams} setData={setExams} courses={timetable}/></div>}
          {view==="grades"&&<Grades data={grades} setData={setGrades}/>}
          {view==="specs"&&<Specs data={specs} setData={setSpecs}/>}
          {view==="people"&&<People data={people} setData={setPeople}/>}
          {view==="records"&&<Records data={records} setData={setRecords}/>}
          {view==="bucket"&&<Bucket data={buckets} setData={setBuckets}/>}
          {view==="team"&&<Teamwork data={teamwork} setData={setTeamwork}/>}
          {view==="links"&&<Bookmarks data={bookmarks} setData={setBookmarks}/>}
        </main>
      </div>
    </>
  )
}
