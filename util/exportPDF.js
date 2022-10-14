const Vaccine = (pdfDoc, data) => {
    pdfDoc.fontSize(26).text('Thông tin tiêm vaccine');
    pdfDoc.text('----------------------------');
    data.forEach((d, i) => {
        pdfDoc.fontSize(18).text(i + 1);
        pdfDoc.fontSize(14).text('Ngày tiêm vaccine: ' + d.dateVac);
        pdfDoc.fontSize(14).text('Type of vaccine: '+ d.typeVac);
        pdfDoc.text('----------');
    });
    pdfDoc.fontSize(20).text(`Results of ${data.length} vaccinations`, { underline: true });
};

const DatePositive = (pdfDoc, data) => {
    pdfDoc.fontSize(26).text('Thong tin ngay duong tinh');
    pdfDoc.text('----------------------------');
    data.forEach((d, i) => {
        pdfDoc.fontSize(18).text(i + 1);
        pdfDoc.fontSize(14).text('Ngay: ' + d);
        pdfDoc.text('----------');
    });
};

const TempBody = (pdfDoc, data) => {
    pdfDoc.fontSize(26).text('Thong tin do nhiet do co the');
    pdfDoc.text('----------------------------');
    data.forEach((d, i) => {
        pdfDoc.fontSize(18).text(i + 1);
        pdfDoc.fontSize(14).text('Ngay: ' + d.dateTemp);
        pdfDoc.fontSize(14).text(`Nhiet do do duoc: ${d.temp} oC`);
        pdfDoc.text('----------');
    });
};

const PDFFile = (type, pdfDoc, data) => {
    if (type === 'vaccine') Vaccine(pdfDoc, data);
    else if (type === 'datePositive') DatePositive(pdfDoc, data);
    else if (type === 'tempBody') TempBody(pdfDoc, data);
    else console.log('Lỗi type, type: ', type);
};

exports.PDFFile = PDFFile;