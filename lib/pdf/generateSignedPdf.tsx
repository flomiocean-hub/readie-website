import React from 'react'
import { renderToBuffer, Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer'

import path from 'path'

const FONTS_DIR = path.join(process.cwd(), 'public', 'fonts')

Font.register({
  family: 'NotoSansTC',
  fonts: [
    { src: path.join(FONTS_DIR, 'NotoSansTC-400.woff'), fontWeight: 400 },
    { src: path.join(FONTS_DIR, 'NotoSansTC-700.woff'), fontWeight: 700 },
  ],
})

const S = StyleSheet.create({
  page:        { padding: '40px 48px', fontFamily: 'NotoSansTC', fontSize: 10, color: '#1C2B2B', backgroundColor: '#fff' },
  header:      { borderBottom: '2px solid #1C2B2B', paddingBottom: 12, marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  brand:       { fontSize: 16, fontWeight: 700, color: '#1C2B2B' },
  brandDot:    { color: '#D46B2F' },
  contractNo:  { fontSize: 9, color: '#9ca3af', fontFamily: 'NotoSansTC' },
  docTitle:    { fontSize: 17, fontWeight: 700, textAlign: 'center', marginBottom: 6 },
  docSub:      { fontSize: 10, color: '#6b7280', textAlign: 'center', marginBottom: 24 },
  section:     { marginBottom: 14 },
  sectionTitle:{ fontSize: 10, fontWeight: 700, marginBottom: 5, color: '#1C2B2B' },
  bodyText:    { fontSize: 9, lineHeight: 1.8, color: '#374151' },
  metaBox:     { backgroundColor: '#FAF8F4', borderRadius: 6, padding: '12px 14px', marginTop: 20, marginBottom: 20 },
  metaRow:     { flexDirection: 'row', marginBottom: 5 },
  metaLabel:   { fontSize: 9, fontWeight: 700, color: '#9ca3af', width: 80 },
  metaValue:   { fontSize: 9, color: '#1C2B2B', flex: 1 },
  sigBox:      { marginTop: 20, borderTop: '1.5px solid #e5e7eb', paddingTop: 16, flexDirection: 'row', gap: 32 },
  sigParty:    { flex: 1 },
  sigLabel:    { fontSize: 9, color: '#9ca3af', marginBottom: 8 },
  sigImage:    { height: 60, objectFit: 'contain', marginBottom: 6, border: '1px solid #e5e7eb', borderRadius: 4, backgroundColor: '#fff' },
  sigName:     { fontSize: 10, fontWeight: 700, marginBottom: 3 },
  sigMeta:     { fontSize: 8, color: '#9ca3af' },
  footer:      { position: 'absolute', bottom: 28, left: 48, right: 48, borderTop: '1px solid #e5e7eb', paddingTop: 8, flexDirection: 'row', justifyContent: 'space-between' },
  footerText:  { fontSize: 8, color: '#d1d5db' },
  tableHead:   { flexDirection: 'row', backgroundColor: '#FAF8F4', padding: '5px 8px', borderRadius: 4, marginBottom: 2 },
  tableRow:    { flexDirection: 'row', padding: '5px 8px', borderBottom: '1px solid #f3f4f6' },
  totalRow:    { flexDirection: 'row', padding: '6px 8px', justifyContent: 'flex-end' },
  totalFinal:  { flexDirection: 'row', padding: '8px 8px', borderTop: '2px solid #1C2B2B', justifyContent: 'flex-end', marginTop: 4 },
})

// NDA 條款全文
const NDA_CLAUSES = [
  {
    title: '第一條　保密資訊之定義',
    body: '「保密資訊」係指一方（「揭露方」）向他方（「接收方」）揭露之任何資料、文件、技術知識、商業計畫、客戶名單、財務資訊、系統架構或其他具有商業價值之資訊，無論以書面、口頭、電子或其他形式為之。',
  },
  {
    title: '第二條　保密義務',
    body: '接收方同意：（一）對保密資訊嚴格保密，其保護程度不得低於接收方保護自身同類機密資訊之標準，且不得低於合理謹慎之注意標準；（二）除履行本合約之目的外，不得使用保密資訊；（三）未經揭露方事前書面同意，不得向任何第三人揭露保密資訊。',
  },
  {
    title: '第三條　例外事項',
    body: '下列情形不適用本合約之保密義務：（一）資訊於接收時已為公眾所知悉者；（二）資訊嗣後因非接收方之行為而進入公共領域者；（三）接收方能證明該資訊係其獨立開發，未使用任何保密資訊者；（四）依法律規定或政府命令須予揭露者，但接收方應事前通知揭露方並協助其採取保護措施。',
  },
  {
    title: '第四條　資訊之返還或銷毀',
    body: '於揭露方書面要求，或本合約終止後，接收方應立即返還揭露方所提供之全部保密資訊，或依揭露方指示予以銷毀，並以書面確認已完成銷毀。',
  },
  {
    title: '第五條　智慧財產權',
    body: '本合約之簽署及保密資訊之揭露，不構成對接收方授予任何智慧財產權之授權，亦不得解釋為雙方間之合夥、代理或其他商業合作關係。',
  },
  {
    title: '第六條　有效期間',
    body: '本合約自簽署日起生效，有效期間為三（3）年。合約終止後，有關保密義務之條款仍繼續有效三（3）年。',
  },
  {
    title: '第七條　違約責任',
    body: '任一方違反本合約之保密義務，應賠償他方因此所受之一切損失，並另給付違約金新台幣壹佰萬元整（NT$1,000,000）。前開違約金之約定，不影響受害方就實際損害超過違約金部分另行請求賠償之權利。',
  },
  {
    title: '第八條　禁止救濟',
    body: '雙方確認，若本合約之保密義務遭受違反，揭露方可能無法獲得充分之金錢賠償，故揭露方有權在不提供擔保之情形下，向有管轄權之法院聲請禁止令或其他衡平救濟。',
  },
  {
    title: '第九條　準據法與管轄',
    body: '本合約之解釋及效力，依中華民國法律為準據法。因本合約所生之一切爭議，雙方合意以台灣台北地方法院為第一審管轄法院。',
  },
  {
    title: '第十條　完整協議',
    body: '本合約構成雙方就保密事項之完整合意，取代雙方先前就此事項之一切口頭或書面協議。本合約之修改，應以書面為之，並經雙方簽署始生效力。',
  },
]

type LineItem = { name: string; description: string; unit_price: number; qty: number; subtotal: number }

type DocData = {
  contract_number: string
  type: string
  client_name: string
  client_company: string | null
  client_email: string
  line_items: LineItem[]
  discount_type: string | null
  discount_value: number | null
  payment_terms: string | null
  payment_note: string | null
  note: string | null
  signature_name: string
  signature_image: string | null
  signed_at: string
  signer_ip: string
}

export async function generateSignedPdf(doc: DocData): Promise<Buffer> {
  const signedAt = new Date(doc.signed_at).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })
  const isNda = doc.type === 'nda'
  const typeLabel = isNda ? '保密合約書（NDA）' : '報價確認單'

  // 計算報價總計
  const lineItems = doc.line_items ?? []
  const subtotal = lineItems.reduce((s, i) => s + i.subtotal, 0)
  const discountAmt = doc.discount_type === 'percent'
    ? Math.round(subtotal * ((doc.discount_value ?? 0) / 100))
    : (doc.discount_value ?? 0)
  const total = subtotal - discountAmt

  const paymentLabel =
    doc.payment_terms === 'full' ? '簽約後全額付清' :
    doc.payment_terms === 'split' ? '50% 訂金 + 50% 完工後付清' :
    doc.payment_note ?? ''

  const element = (
    <Document>
      <Page size="A4" style={S.page}>
        {/* Header */}
        <View style={S.header}>
          <Text style={S.brand}>Readie<Text style={S.brandDot}>.</Text></Text>
          <Text style={S.contractNo}>{doc.contract_number}</Text>
        </View>

        {/* 標題 */}
        <Text style={S.docTitle}>{typeLabel}</Text>
        <Text style={S.docSub}>
          {doc.client_name}{doc.client_company ? `　${doc.client_company}` : ''}
        </Text>

        {/* 簽署摘要 */}
        <View style={S.metaBox}>
          <View style={S.metaRow}>
            <Text style={S.metaLabel}>合約編號</Text>
            <Text style={S.metaValue}>{doc.contract_number}</Text>
          </View>
          <View style={S.metaRow}>
            <Text style={S.metaLabel}>文件類型</Text>
            <Text style={S.metaValue}>{typeLabel}</Text>
          </View>
          <View style={S.metaRow}>
            <Text style={S.metaLabel}>客戶</Text>
            <Text style={S.metaValue}>{doc.client_name}{doc.client_company ? `（${doc.client_company}）` : ''}</Text>
          </View>
          <View style={S.metaRow}>
            <Text style={S.metaLabel}>Email</Text>
            <Text style={S.metaValue}>{doc.client_email}</Text>
          </View>
          <View style={S.metaRow}>
            <Text style={S.metaLabel}>簽署時間</Text>
            <Text style={S.metaValue}>{signedAt}（台北時間）</Text>
          </View>
          <View style={S.metaRow}>
            <Text style={S.metaLabel}>IP 位址</Text>
            <Text style={S.metaValue}>{doc.signer_ip}</Text>
          </View>
        </View>

        {/* NDA 條款 */}
        {isNda && NDA_CLAUSES.map(c => (
          <View key={c.title} style={S.section}>
            <Text style={S.sectionTitle}>{c.title}</Text>
            <Text style={S.bodyText}>{c.body}</Text>
          </View>
        ))}

        {/* 報價明細 */}
        {!isNda && (
          <View style={S.section}>
            <Text style={S.sectionTitle}>服務品項</Text>
            <View style={S.tableHead}>
              <Text style={{ flex: 3, fontSize: 8, fontWeight: 700, color: '#9ca3af' }}>品項</Text>
              <Text style={{ flex: 1, fontSize: 8, fontWeight: 700, color: '#9ca3af', textAlign: 'right' }}>單價</Text>
              <Text style={{ flex: 0.5, fontSize: 8, fontWeight: 700, color: '#9ca3af', textAlign: 'center' }}>數量</Text>
              <Text style={{ flex: 1, fontSize: 8, fontWeight: 700, color: '#9ca3af', textAlign: 'right' }}>小計</Text>
            </View>
            {lineItems.map((item, i) => (
              <View key={i} style={S.tableRow}>
                <View style={{ flex: 3 }}>
                  <Text style={{ fontSize: 9, color: '#1C2B2B' }}>{item.name}</Text>
                  {item.description ? <Text style={{ fontSize: 8, color: '#9ca3af' }}>{item.description}</Text> : null}
                </View>
                <Text style={{ flex: 1, fontSize: 9, textAlign: 'right' }}>NT$ {item.unit_price.toLocaleString()}</Text>
                <Text style={{ flex: 0.5, fontSize: 9, textAlign: 'center' }}>{item.qty}</Text>
                <Text style={{ flex: 1, fontSize: 9, fontWeight: 700, textAlign: 'right' }}>NT$ {item.subtotal.toLocaleString()}</Text>
              </View>
            ))}
            <View style={S.totalRow}>
              <Text style={{ fontSize: 9, color: '#9ca3af', marginRight: 24 }}>小計</Text>
              <Text style={{ fontSize: 9 }}>NT$ {subtotal.toLocaleString()}</Text>
            </View>
            {discountAmt > 0 && (
              <View style={S.totalRow}>
                <Text style={{ fontSize: 9, color: '#D46B2F', marginRight: 24 }}>折扣</Text>
                <Text style={{ fontSize: 9, color: '#D46B2F' }}>- NT$ {discountAmt.toLocaleString()}</Text>
              </View>
            )}
            <View style={S.totalFinal}>
              <Text style={{ fontSize: 11, fontWeight: 700, marginRight: 24 }}>總計</Text>
              <Text style={{ fontSize: 11, fontWeight: 700 }}>NT$ {total.toLocaleString()}</Text>
            </View>
            {paymentLabel && (
              <Text style={{ fontSize: 9, color: '#9ca3af', marginTop: 8 }}>付款方式：{paymentLabel}</Text>
            )}
            {doc.note && (
              <Text style={{ fontSize: 9, color: '#9ca3af', marginTop: 4 }}>備註：{doc.note}</Text>
            )}
          </View>
        )}

        {/* 簽名欄 */}
        <View style={S.sigBox}>
          {/* 乙方（客戶） */}
          <View style={S.sigParty}>
            <Text style={S.sigLabel}>乙方（客戶）簽名</Text>
            {doc.signature_image
              ? <Image src={doc.signature_image} style={S.sigImage} />
              : <View style={[S.sigImage, { justifyContent: 'center', alignItems: 'center' }]}>
                  <Text style={{ fontSize: 9, color: '#9ca3af' }}>電子簽名</Text>
                </View>
            }
            <Text style={S.sigName}>{doc.signature_name}</Text>
            <Text style={S.sigMeta}>{doc.client_email}</Text>
            <Text style={S.sigMeta}>{signedAt}</Text>
          </View>
          {/* 甲方（Readie AI） */}
          <View style={S.sigParty}>
            <Text style={S.sigLabel}>甲方（Readie AI / 劉志傑）</Text>
            <View style={[S.sigImage, { justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={{ fontSize: 9, color: '#9ca3af' }}>系統核發</Text>
            </View>
            <Text style={S.sigName}>劉志傑</Text>
            <Text style={S.sigMeta}>marco@readie.ai</Text>
            <Text style={S.sigMeta}>{signedAt}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={S.footer} fixed>
          <Text style={S.footerText}>Readie Sign　{doc.contract_number}</Text>
          <Text style={S.footerText} render={({ pageNumber, totalPages }) => `第 ${pageNumber} / ${totalPages} 頁`} />
        </View>
      </Page>
    </Document>
  )

  return await renderToBuffer(element)
}
