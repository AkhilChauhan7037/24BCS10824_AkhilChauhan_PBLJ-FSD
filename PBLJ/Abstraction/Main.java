package Abstraction;

abstract class Bank {
    private int balance = 1000;
    public void getBalance() {
        System.out.println("Current Balance: " + balance);
    }
    protected void setBalance(int amount) {
        balance = amount;
    }
    protected int getCurrentBalance() {
        return balance;
    }
    public abstract void debit(int amount);
    public abstract void credit(int amount);
}
class Sbi extends Bank {
    @Override
    public void debit(int amount) {
        int currentBalance=getCurrentBalance();
        if (amount <= currentBalance) {
            currentBalance-=amount;
            setBalance(currentBalance);
        } else {
            System.out.println("Insufficient Balance");
        }
    }
    @Override
    public void credit(int amount) {
        int currentBalance=getCurrentBalance();
        currentBalance+=amount;
        setBalance(currentBalance);
    }
}
public class Main {
    public static void main(String[] args) {
        Sbi account=new Sbi();
        account.getBalance();
        account.credit(500);
        account.getBalance();
        account.debit(300);
        account.getBalance();
    }
}