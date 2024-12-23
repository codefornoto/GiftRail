function doGet(e) {
  const sheetName = e.parameter.sheetName
  return getMarkersAsJson(sheetName, e)
}

function getMarkersAsJson(sheetName, e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName)
  const data = sheet.getDataRange().getValues()
  const headers = data[0]
  const items = []

  // ヘッダー行をスキップしてデータを処理
  for (let i = 1; i < data.length; i++) {
    const row = data[i]
    let item
    item = createMarkerItem(row, headers)
    items.push(item)
  }

  Logger.log(items)
  // JSONとしてレスポンスを返す
  return ContentService.createTextOutput(
    JSON.stringify({
      status: 'success',
      data: items,
    }),
  ).setMimeType(ContentService.MimeType.JSON)
}

function createMarkerItem(row, headers) {
  return {
    id: row[headers.indexOf('ID')],
    latitude: row[headers.indexOf('latitude')],
    longitude: row[headers.indexOf('longitude')],
    message: row[headers.indexOf('message')],
    color: row[headers.indexOf('color')],
    timestamp: row[headers.indexOf('timestamp')],
  }
}

// スプレッドシートにマーカーを追加する関数
function addMarker(marker, sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName)
  const lastRow = sheet.getLastRow()

  sheet.appendRow([
    lastRow,
    marker.latitude,
    marker.longitude,
    marker.message,
    marker.color,
    marker.timestamp,
  ])

  return true
}

function doPost(e) {
  const sheetName = e.parameter.sheetName
  try {
    const postData = JSON.parse(e.postData.contents)

    // タイムスタンプを追加
    postData.timestamp = new Date().toISOString()

    const result = addMarker(postData, sheetName)

    return ContentService.createTextOutput(
      JSON.stringify({
        status: 'success',
        data: result,
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({
        status: 'error',
        message: error.toString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  }
}

function testGet() {
  const sheetName = 'test001'
  const e = { parameter: { sheetName: sheetName } }
  const result = doGet(e) // doGet関数を呼び出す
  Logger.log(result) // 結果をログに出力
}

function testPost() {
  const sheetName = 'test002'
  const postData = {
    latitude: 35.6895,
    longitude: 139.6917,
    message: 'テストメッセージ',
    color: '#FF0057',
  }
  const e = {
    parameter: { sheetName: sheetName },
    postData: { contents: JSON.stringify(postData) },
  }
  const result = doPost(e)
  Logger.log(result) // 結果をログに出力
}
