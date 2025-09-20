#include <iostream>
using namespace std;
int main() {
    int  n=4;
    for(int i=0;i<n;i++){
        char x = 'A';
        for(int j=0;j<4;j++){
            cout<<x<<" ";
            x= x+1;
        }
        cout<<endl;
    }
    return 0;
}