package com.pms.service.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class DateUtil {
	
	private static final String format = "yyyy/MM/dd HH:mm:ss";
	
	public static String getDateString(Date date){
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		return sdf.format(date);
	}
	
	public static Date getDate(String date) throws ParseException{
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
		return sdf.parse(date);
	}
	
	public static Integer getSimpleDay(Long times) {
		Date date = new Date();
		if(times != null) {
			date = new Date(times);
		}
		SimpleDateFormat format = new SimpleDateFormat("yyyyMMdd");
		String str = format.format(date);
		return Integer.valueOf(str);
	}
	
	public static long getDateByNum(Integer times) {
		long lo = 0;
		try {
			if(times != null){
				Date date = new SimpleDateFormat("yyyyMMdd").parse(String.valueOf(times));
				lo = date.getTime();
			}
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return lo;
	}
	
	public static Integer getNextDay(Integer day){
		Integer nextDay = 0;
		try {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
			Date date = sdf.parse(String.valueOf(day));
			Calendar cal=Calendar.getInstance();
			cal.setTime(date);
			cal.add(Calendar.DAY_OF_YEAR, 1);
			nextDay = Integer.valueOf(sdf.format(cal.getTime()));
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return nextDay;
	}
	
	public static Date getDate(Long times){
		return new Date(times);
	}
	
	public static String getDateStringByLong(Long times){
	    SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
	    return sdf.format(new Date(times));
	}
	
	public static Date setDateZero(Long dl){
		Date date = new Date(dl);
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		return date;
	}
	
	public static Long getYearTimeByAge(int age){
	    Long now = getJustYearNow().getTime();
	    Long temp = Long.parseLong(String.valueOf(age));
	    Long ageTime = temp * 365 * 24 *60 *60 *1000;
	    return now - ageTime;
	}
	
	public static Date getJustYearNow(){
	    Date now = new Date();
	    Date year = null;
	    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
	    String nowString = sdf.format(now);
	    try {
            year = sdf.parse(nowString);
        } catch (ParseException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
	    return year;
	}
	
	public static Long addDays(int day){
		Calendar cal = Calendar.getInstance();
		cal.add(Calendar.DAY_OF_YEAR, day);
		cal.set(Calendar.HOUR_OF_DAY, 0);
		cal.set(Calendar.MINUTE, 0);
		cal.set(Calendar.SECOND, 0);
		return cal.getTimeInMillis();
	}
	
	public static boolean isInToday(Long l){
	    Long aDay = 24 * 60 * 60 *1000l;
	    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
	    String createdOn = sdf.format(new Date(l));
	    String today = sdf.format(new Date());
	    if (today.equals(createdOn)){
	        return true;
	    }else{
	        return false;
	    }
	}
	
	public static int getAgeByBirthDay(Object birth){
	            
	    int birthYear = 1990;
	    int nowYear;
	    Calendar c = Calendar.getInstance();
	    nowYear = c.get(Calendar.YEAR);
	    if (birth != null){
	        Date birthDay = new Date(Long.parseLong(String.valueOf(birth)));
	        c.setTime(birthDay);
	        birthYear = c.get(Calendar.YEAR);
	    }
	    return nowYear - birthYear;
	    
	}
	
	public static int getDaysDuringTwoDate(Long begin){
		Long end = new Date().getTime();
		int aDay = 24*60*60*1000;//86400000
		int days = (int) ((end - begin)/aDay) + 1;
		return days;
	}
	
	public static int getNowYearString(){
		Calendar c = Calendar.getInstance();
		return c.get(Calendar.YEAR);
	}
	
	public static void main(String[] args) throws ParseException{
	    getAgeByBirthDay(null);
//	    getJustYearNow();
//	    System.out.println(getDate("2012/12/21"));
//		System.out.println(getDateString(new Date()));
//		System.out.println(getDate("1990/12/12").getTime()); //660931200000
	}
}
