public class JDBCTest01{
	public static void main(String[] args){
		Connection conn=null;
		Statement stmt=null;
		ResultSet rs=null;
		try{
				//1.ע������
				class.froName("com.mysql.jdbc.Driver");
				//2.��ȡ����
				String url="jdbc.mysql://127.0.0.1:3306/db1;
				String user="root";
				String password="mima";
				conn=DriverManager.getConnection(url,user,password);
				//3.��ȡ���ݿ��������(Statementר��ִ��sql����)
				stmt = conn.createStatement();
				//4.ִ��sql
				String sql="select name as a,password,id  from emp;"
				//ר��ִ��DQL����
				rs=stmt.executeQuery(Sql);
				//5.�����ѯ�����re.next()����true����������
				while(rs.next()){  //get(1) 2 3 ������ǵڼ�������,Ҳ����ͨ������ȥ��
					//String name=rs.getString(1);
					String name=rs.getString("a"); //���ղ�ѯ�����������,����б���,��ô������������Ǳ���
					//���������������͵�������
					String password=rs.getDouble(2);
					String password=rs.getDouble("password");
					String password=rs.getString(2);
					
					String id=rs.getString(3);
				}
		}cathch(Exception e){
			e.printStackTrace();
		}finally{
			//6.�ͷ���Դ
			//Ϊ�˱�֤��Դһ���ͷ�,��finally�����йر���Դ
			//����Ҫ��ѭ��С����һ�ιر�
			//�ֱ����try-catch
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