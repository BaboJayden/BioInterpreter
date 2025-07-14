document.getElementById("submit").addEventListener("click", () => {
    const type = document.getElementById("datatype").value;
    const input = document.getElementById("datatext").value.trim().toUpperCase();

    if (!/^[ATCGU]+$/.test(input)) {
        alert("A, T, C, G(U)만 입력하세요.");
        return;
    }

    let template = "", nonTemplate = "", mrna = "", trna = "", protein = "";

    const dnaComplement = { A: "T", T: "A", C: "G", G: "C" };
    const rnaComplement = { A: "U", T: "A", C: "G", G: "C", U: "A" };

    if (type === "I") {
        template = input;
        nonTemplate = [...input].map(b => dnaComplement[b]).join("");
        mrna = [...input].map(b => rnaComplement[b]).join("");
    } else if (type === "II") {
        nonTemplate = input;
        template = [...input].map(b => dnaComplement[b]).join("");
        mrna = [...template].map(b => rnaComplement[b]).join("");
    } else if (type === "mRNA") {
        mrna = input;
        template = [...input].map(b => rnaComplement[b]).join("");
        nonTemplate = [...template].map(b => dnaComplement[b]).join("");
    }

    // tRNA: 3개씩 끊어서 보기 좋게
    const trnaArr = [...mrna].map(b => rnaComplement[b]);
    const trnaCodons = [];
    for (let i = 0; i < trnaArr.length; i += 3) {
        trnaCodons.push(trnaArr.slice(i, i + 3).join(""));
    }
    trna = trnaCodons.join(" ");

    // 한글 단백질 테이블
    const codonTable = {
        UUU: "페닐알라닌", UUC: "페닐알라닌", UUA: "류신", UUG: "류신",
        CUU: "류신", CUC: "류신", CUA: "류신", CUG: "류신",
        AUU: "아이소류신", AUC: "아이소류신", AUA: "아이소류신", AUG: "메싸이오닌",
        GUU: "발린", GUC: "발린", GUA: "발린", GUG: "발린",
        UCU: "세린", UCC: "세린", UCA: "세린", UCG: "세린",
        CCU: "프롤린", CCC: "프롤린", CCA: "프롤린", CCG: "프롤린",
        ACU: "트레오닌", ACC: "트레오닌", ACA: "트레오닌", ACG: "트레오닌",
        GCU: "알라닌", GCC: "알라닌", GCA: "알라닌", GCG: "알라닌",
        UAU: "타이로신", UAC: "타이로신", UAA: "정지", UAG: "정지",
        CAU: "히스티딘", CAC: "히스티딘", CAA: "글루타민", CAG: "글루타민",
        AAU: "아스파라진", AAC: "아스파라진", AAA: "라이신", AAG: "라이신",
        GAU: "아스파트산", GAC: "아스파트산", GAA: "글루탐산", GAG: "글루탐산",
        UGU: "시스테인", UGC: "시스테인", UGA: "정지", UGG: "트립토판",
        CGU: "아르기닌", CGC: "아르기닌", CGA: "아르기닌", CGG: "아르기닌",
        AGU: "세린", AGC: "세린", AGA: "아르기닌", AGG: "아르기닌",
        GGU: "글라이신", GGC: "글라이신", GGA: "글라이신", GGG: "글라이신"
    };

    const mrnaCodons = [];
    for (let i = 0; i < mrna.length - 2; i += 3) {
        const codon = mrna.slice(i, i + 3);
        if (codon.length < 3) break;
        const amino = codonTable[codon];
        if (!amino || amino === "정지") break;

        // <span data-amino="아미노산이름">이름</span> 으로 감싸기
        const span = `<span class="amino" data-amino="${amino}">${amino}</span>`;
        mrnaCodons.push(span);
    }
    protein = mrnaCodons.join(" - ");

    // 결과 출력
    document.querySelector(".I").textContent = template;
    document.querySelector(".II").textContent = nonTemplate;
    document.querySelector(".mRNA").textContent = mrna;
    document.querySelector(".tRNA").textContent = trna;
    document.querySelector(".protein").innerHTML = protein;
});

// 이벤트 위임
document.querySelector(".protein").addEventListener("click", (e) => {
    if (e.target.classList.contains("amino")) {
        const aminoName = e.target.dataset.amino;
        const info = aminoInfo[aminoName] || "정보가 없습니다.";

        document.getElementById("modal-title").textContent = aminoName;
        document.getElementById("modal-info").textContent = info;
        document.getElementById("modal").classList.remove("hidden");
    }
});

// 닫기 버튼
document.querySelector(".close").addEventListener("click", () => {
    document.getElementById("modal").classList.add("hidden");
});
