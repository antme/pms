package com.pms.service.util;


import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;

public class ExcleUtil {

	Workbook wb = null;
	InputStream fis = null;
	OutputStream fos = null;
	private String path = null;
	private File file = null;
	List<String[]> dataList = new ArrayList<String[]>(100);

	public ExcleUtil(){}
	
	public ExcleUtil(File file){
		try {
			this.file = file;
			fis = new FileInputStream(file);
			wb = WorkbookFactory.create(fis);
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (InvalidFormatException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public ExcleUtil(String path) {
		try {
			this.path = path;
			fis = new FileInputStream(path);
//			fos = new FileOutputStream(path);
			wb = WorkbookFactory.create(fis);
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (InvalidFormatException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}

	}

	public List<String[]> getAllData(int sheetIndex) {
		int columnNum = 0;
		Sheet sheet = wb.getSheetAt(sheetIndex);
		if (sheet.getRow(0) != null) {
			columnNum = sheet.getRow(0).getLastCellNum()
					- sheet.getRow(0).getFirstCellNum();
		}
		if (columnNum > 0) {
			for (Row row : sheet) {
				String[] singleRow = new String[columnNum];
				int n = 0;
				for (int i = 0; i < columnNum; i++) {
					Cell cell = row.getCell(i, Row.CREATE_NULL_AS_BLANK);
					switch (cell.getCellType()) {
					case Cell.CELL_TYPE_BLANK:
						singleRow[n] = "";
						break;
					case Cell.CELL_TYPE_BOOLEAN:
						singleRow[n] = Boolean.toString(cell
								.getBooleanCellValue());
						break;
					
					case Cell.CELL_TYPE_NUMERIC:
						if (DateUtil.isCellDateFormatted(cell)) {
							singleRow[n] = String.valueOf(cell
									.getDateCellValue());
						} else {
							cell.setCellType(Cell.CELL_TYPE_STRING);
							String temp = cell.getStringCellValue();
							//
							if (temp.indexOf(".") > -1) {
								singleRow[n] = String.valueOf(new Double(temp))
										.trim();
							} else {
								singleRow[n] = temp.trim();
							}
						}
						break;
					case Cell.CELL_TYPE_STRING:
						singleRow[n] = cell.getStringCellValue().trim();
						break;
					case Cell.CELL_TYPE_ERROR:
						singleRow[n] = "";
						break;
					case Cell.CELL_TYPE_FORMULA:
						cell.setCellType(Cell.CELL_TYPE_STRING);
						singleRow[n] = cell.getStringCellValue();
						if (singleRow[n] != null) {
							singleRow[n] = singleRow[n].replaceAll("#N/A", "")
									.trim();
						}
						break;
					default:
						singleRow[n] = "";
						break;
					}
					n++;
				}
//				if ("".equals(singleRow[0])) {
//					continue;
//				}
				dataList.add(singleRow);
			}
		}
		return dataList;
	}

	public int getRowNum(int sheetIndex) {
		Sheet sheet = wb.getSheetAt(sheetIndex);
		return sheet.getLastRowNum();
	}

	public int getColumnNum(int sheetIndex) {
		Sheet sheet = wb.getSheetAt(sheetIndex);
		Row row = sheet.getRow(0);
		if (row != null && row.getLastCellNum() > 0) {
			return row.getLastCellNum();
		}
		return 0;
	}

	public String[] getRowData(int sheetIndex, int rowIndex) {
		String[] dataArray = null;
		if (rowIndex > this.getRowNum(sheetIndex)) {
			return dataArray;
		} else {
			dataArray = new String[this.getColumnNum(sheetIndex)];
			return this.dataList.get(rowIndex);
		}

	}

	public String[] getColumnData(int sheetIndex, int colIndex) {
		String[] dataArray = null;
		if (colIndex > this.getColumnNum(sheetIndex)) {
			return dataArray;
		} else {
			if (this.dataList != null && this.dataList.size() > 0) {
				dataArray = new String[this.getRowNum(sheetIndex) + 1];
				int index = 0;
				for (String[] rowData : dataList) {
					if (rowData != null) {
						dataArray[index] = rowData[colIndex];
						index++;
					}
				}
			}
		}
		return dataArray;

	}

	public void addRow(int sheetIndex, String[] row) throws Exception {
		int rownum = this.getRowNum(sheetIndex) + 1;
		Sheet sheet = wb.getSheetAt(sheetIndex);
		Row addedRow = sheet.createRow(rownum);
		Cell cell = null;

		int colnum = this.getColumnNum(sheetIndex);
		int count = colnum < row.length ? colnum : row.length;
		for (int i = 0; i < count; i++) {
			cell = addedRow.createCell(i);
			cell.setCellValue(row[i]);
		}
		
		fos = new FileOutputStream(this.path);
		wb.write(this.fos);
		fos.close();
	}
	
	public void updateAppInfo(int sheetIndex, String header, String apkName, String updateValue){}
	
	public void deleteRow(int sheetIndex, String apkName){}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}
	
	
}