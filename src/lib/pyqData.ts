export interface PYQ {
  year: number;
  subject: string;
  fileId: string; // The ID from your Google Drive share link
  title: string;
  ansKeyId: string
}

export const pyqList: PYQ[] = [
  // { year: 2026, subject: "Biology", fileId: "", title: "Previous Year Question", ansKeyId: "" },
  { year: 2025, subject: "Biology", fileId: "1R3blwyfcgocXEkYe9jU1TXUjx1d3FKPN", title: "Previous Year Question", ansKeyId: "1aBatEijEX0FynCeERjNPvP7EGBA0SpAr" },
  { year: 2024, subject: "Biology", fileId: "1Ne-r2e3yDCfme1BptwFPhKtoSvYpVbvN", title: "Previous Year Question", ansKeyId: "1RPqQeUjEhTnH7P_hVUqUeBG0_5J9XXZf" },
  { year: 2023, subject: "Biology", fileId: "1pDMvV8yB4RehfFpntK7jWz8qGaSXR52z", title: "Previous Year Question", ansKeyId: "1FdaDnWik2-B_7B9UCEso5WIfLSFPpDLbk" },
  // { year: 2022, subject: "Biology", fileId: "", title: "Previous Year Question", ansKeyId: "" },
  { year: 2021, subject: "Biology", fileId: "13PTOA6dcxgRfNJEZ_fP-ML5u2bUlGPDs", title: "Previous Year Question", ansKeyId: "1U76C06uuLqalXrMZ7SIpwJH610tQIJKq" },
  { year: 2020, subject: "Biology", fileId: "12PHQiNMyeudZSTozCJ-6E7wBtenNqm0J", title: "Previous Year Question", ansKeyId: "1QK_q-428VZkT4meyE0lI0I1MV9Vg1bgm" },
  // { year: 2019, subject: "Biology", fileId: "", title: "Previous Year Question", ansKeyId: "" },
  { year: 2018, subject: "Biology", fileId: "1ZMzoyjNy5h5fe_miXBJ5UPfIxSOYyExv", title: "Previous Year Question", ansKeyId: "1X9UTW-SfGJBwcpTGP56FLudVoA9aeLPo" },



  // Add all 10 years here...
];