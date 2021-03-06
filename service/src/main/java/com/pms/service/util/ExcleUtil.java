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
import java.util.Map;
import java.util.UUID;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;

import com.pms.service.cfg.ConfigurationManager;
import com.pms.service.mockbean.PurchaseCommonBean;
import com.pms.service.mockbean.SalesContractBean;

public class ExcleUtil {

	Workbook wb = null;
	InputStream fis = null;
	OutputStream fos = null;
	private String path = null;
	private File file = null;

	public ExcleUtil(){}
	
	public ExcleUtil(InputStream is){
		try {
			wb = WorkbookFactory.create(is);
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (InvalidFormatException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
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

	public int getNumberOfSheets() {
		return wb.getNumberOfSheets();
	}
	
	
	public String getSheetName(int index) {
		return wb.getSheetAt(index).getSheetName();
	}
	
    public List<String[]> getAllData(int sheetIndex) {
        Sheet sheet = wb.getSheetAt(sheetIndex);
     
        
        List<String[]> dataList = new ArrayList<String[]>( sheet.getLastRowNum());
        for (Row row : sheet) {

            if (row.getLastCellNum() > 0) {
                String[] singleRow = new String[row.getLastCellNum()];
                for (int i = 0; i < row.getLastCellNum(); i++) {
                    Cell cell = row.getCell(i, Row.CREATE_NULL_AS_BLANK);
                    switch (cell.getCellType()) {
                    case Cell.CELL_TYPE_BLANK:
                        singleRow[i] = "";
                        break;
                    case Cell.CELL_TYPE_BOOLEAN:
                        singleRow[i] = Boolean.toString(cell.getBooleanCellValue());
                        break;

                    case Cell.CELL_TYPE_NUMERIC:
                        if (DateUtil.isCellDateFormatted(cell)) {
                            singleRow[i] = String.valueOf(cell.getDateCellValue());
                        } else {
                            cell.setCellType(Cell.CELL_TYPE_STRING);
                            String temp = cell.getStringCellValue();
                            //
                            if (temp.indexOf(".") > -1) {
                                singleRow[i] = String.valueOf(new Double(temp)).trim();
                            } else {
                                singleRow[i] = temp.trim();
                            }
                        }
                        break;
                    case Cell.CELL_TYPE_STRING:
                        singleRow[i] = cell.getStringCellValue().trim();
                        break;
                    case Cell.CELL_TYPE_ERROR:
                        singleRow[i] = "";
                        break;
                    case Cell.CELL_TYPE_FORMULA:
                        cell.setCellType(Cell.CELL_TYPE_STRING);
                        singleRow[i] = cell.getStringCellValue();
                        if (singleRow[i] != null) {
                            singleRow[i] = singleRow[i].replaceAll("#N/A", "").trim();
                        }
                        break;
                    default:
                        singleRow[i] = "";
                        break;
                    }
                }

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
		List<String[]> dataList = new ArrayList<String[]>(100);
		String[] dataArray = null;
		if (rowIndex > this.getRowNum(sheetIndex)) {
			return dataArray;
		} else {
			dataArray = new String[this.getColumnNum(sheetIndex)];
			return dataList.get(rowIndex);
		}

	}

	public String[] getColumnData(int sheetIndex, int colIndex) {
		List<String[]> dataList = new ArrayList<String[]>(100);

		
		String[] dataArray = null;
		if (colIndex > this.getColumnNum(sheetIndex)) {
			return dataArray;
		} else {
			if (dataList != null && dataList.size() > 0) {
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

    public void addRow(int sheetIndex, String[] row, int rownum) throws Exception {
        Sheet sheet = null;

        try {
            sheet = wb.getSheetAt(sheetIndex);
        } catch (Exception e) {
        }
        if (sheet == null) {
            sheet = (HSSFSheet) wb.createSheet();
        }

        Row addedRow = sheet.createRow(rownum);
        Cell cell = null;

        int colnum = this.getColumnNum(sheetIndex);
        int count = colnum < row.length ? colnum : row.length;
        for (int i = 0; i < row.length; i++) {
            cell = addedRow.createCell(i);
            cell.setCellValue(row[i]);
        }

        fos = new FileOutputStream(this.file);
        wb.write(this.fos);
        fos.close();
    }
	
	
	public void createFile(File f){
	    wb = new HSSFWorkbook();
	    try {
	        
	        if(f.exists()){
	            f.delete();
	        }
	        f.getParentFile().mkdirs();
	        FileOutputStream fileOut = new FileOutputStream(f);
            wb.write(fileOut);
            fileOut.close();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
	}
	
	public void updateAppInfo(int sheetIndex, String header, String apkName, String updateValue){}
	
	public void deleteRow(int sheetIndex, String apkName){}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}
	
	/**创建设备清单excel文件*/
	public static String createEqcostExcel(Object eqcostList){
        String colunmTitleHeaders[] = new String[] { "No.", "物料代码", "产品名称", "规格型号", "单位", "数量", "成本单价"};
        
        String colunmHeaders[] = new String[] { 
        		SalesContractBean.SC_EQ_LIST_NO, SalesContractBean.SC_EQ_LIST_MATERIAL_CODE, SalesContractBean.SC_EQ_LIST_PRODUCT_NAME, 
        		SalesContractBean.SC_EQ_LIST_PRODUCT_TYPE, SalesContractBean.SC_EQ_LIST_UNIT,PurchaseCommonBean.EQCOST_APPLY_AMOUNT,
        		SalesContractBean.SC_EQ_LIST_BASE_PRICE };
        
        String fileDir = ConfigurationManager.getProperty("file_dir");

        File f = new File(fileDir + UUID.randomUUID().toString() + ".xls");

        return createExcelListFile(eqcostList, colunmTitleHeaders, colunmHeaders, f);
	}

	public static String createExcelListFile(Object eqcostList, String[] colunmTitleHeaders, String[] colunmHeaders, File f) {
		if (f.exists()) {
			f.delete();
		}
		f.getParentFile().mkdirs();
		
	    ExcleUtil eu = new ExcleUtil();
        eu.createFile(f);
        eu = new ExcleUtil(f);

        int i=0;
        try {
            eu.addRow(0, colunmTitleHeaders, i);
        } catch (Exception e) {
            e.printStackTrace();
        }
        if(eqcostList instanceof List){
        	
        	List<Map<String,Object>> eqList = (List<Map<String,Object>>)eqcostList;
        	
            for (Map<String, Object> map : eqList) {
                int length = colunmHeaders.length;
                String rowsData[] = new String[length];

                int index = 0;
                for (String key : colunmHeaders) {
                    if (map.get(key) == null) {
                        rowsData[index] = "";
                    } else {
                        rowsData[index] = map.get(key).toString();
                    }
                    index++;
                }
                try {
                    eu.addRow(0, rowsData, ++i);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

        }
		return f.getAbsolutePath();
    }
	
	
	
}
