import ExcelJS from "exceljs";
import { PRICE_LABELS, formatEat, type ComplaintReport } from "@/lib/report";

// Server-only: builds the downloadable complaint report workbook.

const CRIMSON = "FFE8174B";
const HEADER_FILL: ExcelJS.Fill = { type: "pattern", pattern: "solid", fgColor: { argb: CRIMSON } };
const SECTION_FONT: Partial<ExcelJS.Font> = { bold: true, size: 12, color: { argb: CRIMSON } };

function styleHeader(row: ExcelJS.Row) {
  row.eachCell((cell) => {
    cell.fill = HEADER_FILL;
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.alignment = { vertical: "middle" };
  });
  row.height = 20;
}

function dataSheet(
  wb: ExcelJS.Workbook,
  name: string,
  columns: { header: string; width: number }[],
  rows: (string | number)[][]
) {
  const ws = wb.addWorksheet(name, { views: [{ state: "frozen", ySplit: 1 }] });
  ws.columns = columns.map((c) => ({ header: c.header, width: c.width }));
  styleHeader(ws.getRow(1));
  for (const r of rows) {
    const row = ws.addRow(r);
    row.alignment = { vertical: "top", wrapText: true };
  }
  if (rows.length) {
    ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: columns.length } };
  }
  return ws;
}

export async function buildComplaintWorkbook(report: ComplaintReport): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Discount Centre";
  wb.created = new Date();

  const { period, previous } = report;
  const periodWord = period.type === "week" ? "Week" : "Month";

  // --- Summary ---
  const ws = wb.addWorksheet("Summary");
  ws.columns = [{ width: 42 }, { width: 18 }, { width: 18 }];

  ws.addRow(["Discount Centre — Complaint Report"]).font = { bold: true, size: 16, color: { argb: CRIMSON } };
  ws.addRow([`${periodWord}: ${period.label}`]).font = { bold: true, size: 12 };
  ws.addRow([`Generated ${formatEat(new Date().toISOString())} (East Africa Time)`]).font = {
    italic: true,
    color: { argb: "FF6B7280" },
  };
  ws.addRow([]);

  ws.addRow(["Key figures"]).font = SECTION_FONT;
  styleHeader(ws.addRow(["Metric", period.label, previous.label]));

  const rate = (v: number | null) => (v === null ? "n/a" : v / 100);
  const figures: [string, string | number, string | number][] = [
    ["Reviews", report.totalReviews, report.previousTotal],
    ["Complaints (staff rating under 4 stars)", report.complaints, report.previousComplaints],
    ["Complaint rate (churn risk)", rate(report.complaintRate), rate(report.previousComplaintRate)],
    ["Price complaints (felt prices were high)", report.priceComplaints, ""],
    ["Price complaint rate", rate(report.priceComplaintRate), ""],
    ["Complaints with no reason given", report.complaintsWithoutReason, ""],
    ["Average staff rating (out of 5)", report.averageStaffRating || "n/a", ""],
    ["Return visits", report.returnVisits, ""],
  ];
  for (const f of figures) {
    const row = ws.addRow(f);
    if (f[0].includes("rate")) {
      row.getCell(2).numFmt = "0.0%";
      row.getCell(3).numFmt = "0.0%";
    }
  }
  ws.addRow([]);

  ws.addRow(["Staff rating breakdown"]).font = SECTION_FONT;
  styleHeader(ws.addRow(["Rating", "Reviews", "Share"]));
  for (const b of report.ratingBreakdown) {
    const row = ws.addRow([b.label, b.count, report.totalReviews ? b.count / report.totalReviews : 0]);
    row.getCell(3).numFmt = "0.0%";
  }
  ws.addRow([]);

  ws.addRow(["Complaints by how the customer found us"]).font = SECTION_FONT;
  styleHeader(ws.addRow(["Channel", "Complaints"]));
  if (report.complaintsByChannel.length) {
    for (const c of report.complaintsByChannel) ws.addRow([c.label, c.count]);
  } else {
    ws.addRow(["No complaints this period", 0]);
  }
  ws.addRow([]);

  ws.addRow(["Notes"]).font = SECTION_FONT;
  for (const note of [
    "A complaint is a review with a staff rating under 4 stars.",
    "A price complaint is a review where the customer rated prices 'a bit pricier' or 'much pricier' than other stores.",
    "Complaint rate is the share of customers who left a complaint — use it as the churn-risk indicator.",
    "Return visits only count customers who scanned the QR code again, so they understate real repeat visits.",
  ]) {
    ws.addRow([note]).alignment = { wrapText: true };
  }

  // --- Complaints ---
  dataSheet(
    wb,
    "Complaints",
    [
      { header: "Date", width: 20 },
      { header: "Name", width: 22 },
      { header: "Phone", width: 15 },
      { header: "Complaint type", width: 20 },
      { header: "Staff rating", width: 12 },
      { header: "Price", width: 16 },
      { header: "What could we have done better", width: 40 },
      { header: "What made them buy", width: 32 },
      { header: "Found us via", width: 20 },
    ],
    report.rows.map(({ review: r, types }) => [
      formatEat(r.created_at),
      r.name ?? "",
      r.phone_number,
      types.join(" + "),
      r.staff_rating,
      PRICE_LABELS[r.price_rating] ?? r.price_rating,
      r.staff_feedback?.trim() || (types.includes("Staff rating") ? "No reason given" : ""),
      r.purchase_reason,
      r.discovery_channel + (r.discovery_other ? ` — ${r.discovery_other}` : ""),
    ])
  );

  // --- All reviews ---
  dataSheet(
    wb,
    "All reviews",
    [
      { header: "Date", width: 20 },
      { header: "Name", width: 22 },
      { header: "Phone", width: 15 },
      { header: "Staff rating", width: 12 },
      { header: "Price", width: 16 },
      { header: "Found us via", width: 20 },
      { header: "What made them buy", width: 32 },
      { header: "Comment", width: 36 },
    ],
    report.reviews.map((r) => [
      formatEat(r.created_at),
      r.name ?? "",
      r.phone_number,
      r.staff_rating,
      PRICE_LABELS[r.price_rating] ?? r.price_rating,
      r.discovery_channel + (r.discovery_other ? ` — ${r.discovery_other}` : ""),
      r.purchase_reason,
      r.staff_feedback ?? "",
    ])
  );

  return Buffer.from(await wb.xlsx.writeBuffer());
}
