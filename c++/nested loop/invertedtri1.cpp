#include <iostream>
using namespace std;
int main() {
    int  n=5;
    int num=1;
    for(int i=0;i<n;i++){
        for(int j=0;j<i;j++){ //for spaces
            cout<<" ";
        }
        for(int j=0;j<n-i;j++)    { //for numbers
            cout<<i+1;
        }

        cout<<endl;
    }
    return 0;
}