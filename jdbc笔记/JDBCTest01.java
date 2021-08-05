public class JDBCTest01{
	public static void main(String[] args){
		Connection conn=null;
		Statement stmt=null;
		ResultSet rs=null;
		try{
				//1.注册驱动
				class.froName("com.mysql.jdbc.Driver");
				//2.获取连接
				String url="jdbc.mysql://127.0.0.1:3306/db1;
				String user="root";
				String password="mima";
				conn=DriverManager.getConnection(url,user,password);
				//3.获取数据库操作对象(Statement专门执行sql语句的)
				stmt = conn.createStatement();
				//4.执行sql
				String sql="select name as a,password,id  from emp;"
				//专门执行DQL语句的
				rs=stmt.executeQuery(Sql);
				//5.处理查询结果集re.next()返回true代表有数据
				while(rs.next()){  //get(1) 2 3 代表的是第几列数据,也可以通过列名去查
					//String name=rs.getString(1);
					String name=rs.getString("a"); //最终查询结果的列名称,如果有别名,那么他查的列名就是别名
					//还可以以数据类型调用数据
					String password=rs.getDouble(2);
					String password=rs.getDouble("password");
					String password=rs.getString(2);
					
					String id=rs.getString(3);
				}
		}cathch(Exception e){
			e.printStackTrace();
		}finally{
			//6.释放资源
			//为了保证资源一定释放,在finally语句块中关闭资源
			//并且要遵循从小到大一次关闭
			//分别对其try-catch
			try{
				if(rs!=null)
					rs.close();
			}catch{SqlException e}{
				e.pringStackTrace();
			}
			try{
				if(stmt!=null)
					stmt.close();
			}catch{SqlException e}{
				e.pringStackTrace();
			}
			try{
				if(conn!=null)
					conn.close();
			}catch(SqlException e){
				e.pringStackTrace();
			}
			
		}
	}
	
}