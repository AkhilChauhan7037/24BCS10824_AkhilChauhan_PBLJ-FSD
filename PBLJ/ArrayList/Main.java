import java.util.ArrayList;
import java.util.LinkedList;
import java.util.Scanner;

public class Main{
    public static void main(String[] args) {
        Scanner sc=new Scanner(System.in);
        ArrayList<ArrayList<Integer>>list=new ArrayList<>();
        LinkedList<Integer>ll=new LinkedList<>();
        for(int i=0;i<3;i++){
            list.add(new ArrayList<>());
            for(int j=0;j<3;j++){
                list.get(i).add(sc.nextInt());
            }
            
        }
        for(int i=0;i<list.size();i++){
            for(int j=0;j<list.get(i).size();j++){
                int curr=list.get(i).get(j);
                if(curr<5){
                    ll.add(curr*2);
                }
            }
        }

        System.out.println(list);
        System.out.println(ll);
    }
}