"""PDF generation service — invoices and receipts."""
import io
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_RIGHT


def generate_invoice_pdf(invoice_data: dict) -> io.BytesIO:
    """
    Generate an invoice PDF and return as BytesIO buffer.

    invoice_data = {
        "invoice_number": "INV-2024-001",
        "date": "2024-06-14",
        "member_name": "John Doe",
        "member_phone": "9876543210",
        "member_email": "john@example.com",
        "plan_name": "Annual VIP",
        "amount": 15000,
        "discount": 1500,
        "final_amount": 13500,
        "payment_method": "UPI",
        "gym_name": "Vikings Gym & Spa",
        "branch": "Aurangabad",
    }
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer, pagesize=A4,
        topMargin=20 * mm, bottomMargin=20 * mm,
        leftMargin=15 * mm, rightMargin=15 * mm,
    )

    styles = getSampleStyleSheet()
    elements = []

    # Custom styles
    title_style = ParagraphStyle(
        "InvoiceTitle", parent=styles["Title"],
        fontSize=22, textColor=HexColor("#1a1a2e"),
        spaceAfter=4 * mm,
    )
    header_style = ParagraphStyle(
        "GymHeader", parent=styles["Normal"],
        fontSize=10, textColor=HexColor("#666666"),
        alignment=TA_CENTER,
    )
    label_style = ParagraphStyle(
        "Label", parent=styles["Normal"],
        fontSize=10, textColor=HexColor("#888888"),
    )
    value_style = ParagraphStyle(
        "Value", parent=styles["Normal"],
        fontSize=11, textColor=HexColor("#1a1a2e"),
        fontName="Helvetica-Bold",
    )

    # --- Header ---
    elements.append(Paragraph(invoice_data.get("gym_name", "Vikings Gym & Spa"), title_style))
    elements.append(Paragraph(
        f"Branch: {invoice_data.get('branch', 'Aurangabad')} | Tax Invoice",
        header_style,
    ))
    elements.append(Spacer(1, 8 * mm))

    # --- Invoice Info ---
    info_data = [
        [
            Paragraph("Invoice Number", label_style),
            Paragraph(invoice_data.get("invoice_number", ""), value_style),
            Paragraph("Date", label_style),
            Paragraph(invoice_data.get("date", ""), value_style),
        ]
    ]
    info_table = Table(info_data, colWidths=[35 * mm, 55 * mm, 25 * mm, 55 * mm])
    info_table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    elements.append(info_table)
    elements.append(Spacer(1, 6 * mm))

    # --- Bill To ---
    elements.append(Paragraph("Bill To:", label_style))
    elements.append(Paragraph(invoice_data.get("member_name", ""), value_style))
    elements.append(Paragraph(
        f"Phone: {invoice_data.get('member_phone', '')} | Email: {invoice_data.get('member_email', '')}",
        styles["Normal"],
    ))
    elements.append(Spacer(1, 8 * mm))

    # --- Items Table ---
    items_header = ["#", "Description", "Amount (₹)"]
    items_data = [items_header]
    items_data.append([
        "1",
        invoice_data.get("plan_name", "Gym Membership"),
        f"₹{invoice_data.get('amount', 0):,.2f}",
    ])

    discount = invoice_data.get("discount", 0)
    if discount > 0:
        items_data.append(["", "Discount", f"-₹{discount:,.2f}"])

    items_data.append(["", "Total", f"₹{invoice_data.get('final_amount', 0):,.2f}"])

    item_table = Table(items_data, colWidths=[15 * mm, 110 * mm, 45 * mm])
    item_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), HexColor("#1a1a2e")),
        ("TEXTCOLOR", (0, 0), (-1, 0), HexColor("#ffffff")),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 10),
        ("ALIGN", (2, 0), (2, -1), "RIGHT"),
        ("GRID", (0, 0), (-1, -1), 0.5, HexColor("#cccccc")),
        ("ROWBACKGROUNDS", (0, 1), (-1, -2), [HexColor("#f8f8f8"), HexColor("#ffffff")]),
        ("FONTNAME", (0, -1), (-1, -1), "Helvetica-Bold"),
        ("LINEABOVE", (0, -1), (-1, -1), 1, HexColor("#1a1a2e")),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 3 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3 * mm),
    ]))
    elements.append(item_table)
    elements.append(Spacer(1, 6 * mm))

    # --- Payment method ---
    pay_style = ParagraphStyle("PayInfo", parent=styles["Normal"], fontSize=10, alignment=TA_RIGHT)
    elements.append(Paragraph(
        f"Payment Method: {invoice_data.get('payment_method', 'N/A')}",
        pay_style,
    ))
    elements.append(Spacer(1, 15 * mm))

    # --- Footer ---
    footer_style = ParagraphStyle(
        "Footer", parent=styles["Normal"],
        fontSize=9, textColor=HexColor("#999999"), alignment=TA_CENTER,
    )
    elements.append(Paragraph("Thank you for choosing Vikings Gym & Spa!", footer_style))
    elements.append(Paragraph(
        "This is a computer-generated invoice. No signature required.",
        footer_style,
    ))

    doc.build(elements)
    buffer.seek(0)
    return buffer


def generate_receipt_pdf(receipt_data: dict) -> io.BytesIO:
    """
    Generate a simple payment receipt PDF.
    Uses same structure as invoice with minimal fields.
    """
    return generate_invoice_pdf({
        "gym_name": receipt_data.get("gym_name", "Vikings Gym & Spa"),
        "branch": receipt_data.get("branch", "Aurangabad"),
        "invoice_number": receipt_data.get("receipt_number", ""),
        "date": receipt_data.get("date", datetime.now().strftime("%Y-%m-%d")),
        "member_name": receipt_data.get("member_name", ""),
        "member_phone": receipt_data.get("member_phone", ""),
        "member_email": receipt_data.get("member_email", ""),
        "plan_name": receipt_data.get("description", "Payment"),
        "amount": receipt_data.get("amount", 0),
        "discount": receipt_data.get("discount", 0),
        "final_amount": receipt_data.get("final_amount", 0),
        "payment_method": receipt_data.get("payment_method", ""),
    })
