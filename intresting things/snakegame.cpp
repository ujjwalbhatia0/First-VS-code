#include <iostream>
#include <conio.h>
#include <windows.h>
#include <thread>
#include <chrono>

using namespace std;

bool gameOver;
const int width = 30;
const int height = 20;
int x, y, fruitX, fruitY, score;
int tailX[100], tailY[100];
int nTail;
enum eDirection { STOP = 0, LEFT, RIGHT, UP, DOWN };
eDirection dir;

void Setup() {
    gameOver = false;
    dir = STOP;
    x = width / 2;
    y = height / 2;
    fruitX = rand() % width;
    fruitY = rand() % height;
    score = 0;
    nTail = 0;
}

void Draw() {
    cout << "\x1b[H"; // Move cursor to top-left, avoids flicker

    // Top border
    for (int i = 0; i < width + 2; i++) cout << "#";
    cout << endl;

    for (int i = 0; i < height; i++) {
        for (int j = 0; j < width; j++) {
            if (j == 0) cout << "#"; // Left border

            if (i == y && j == x)
                cout << "O"; // Snake head
            else if (i == fruitY && j == fruitX)
                cout << "*"; // Fruit
            else {
                bool print = false;
                for (int k = 0; k < nTail; k++) {
                    if (tailX[k] == j && tailY[k] == i) {
                        cout << "o";
                        print = true;
                        break;
                    }
                }
                if (!print) cout << " ";
            }

            if (j == width - 1) cout << "#"; // Right border
        }
        cout << endl;
    }

    // Bottom border
    for (int i = 0; i < width + 2; i++) cout << "#";
    cout << endl;

    cout << "Score: " << score << endl;
    cout << "Controls: W A S D to move | X to quit mid-game" << endl;
}

void Input() {
    if (_kbhit()) {
        switch (_getch()) {
        case 'a': dir = LEFT; break;
        case 'd': dir = RIGHT; break;
        case 'w': dir = UP; break;
        case 's': dir = DOWN; break;
        case 'x': gameOver = true; break;
        }
    }
}

void Logic() {
    int prevX = tailX[0];
    int prevY = tailY[0];
    int prev2X, prev2Y;
    tailX[0] = x;
    tailY[0] = y;
    for (int i = 1; i < nTail; i++) {
        prev2X = tailX[i];
        prev2Y = tailY[i];
        tailX[i] = prevX;
        tailY[i] = prevY;
        prevX = prev2X;
        prevY = prev2Y;
    }

    switch (dir) {
        case LEFT:  x--; break;
        case RIGHT: x++; break;
        case UP:    y--; break;
        case DOWN:  y++; break;
        default: break;
    }

    // Game Over if hit wall
    if (x >= width || x < 0 || y >= height || y < 0)
        gameOver = true;

    // Game Over if hit itself
    for (int i = 0; i < nTail; i++)
        if (tailX[i] == x && tailY[i] == y)
            gameOver = true;

    // Fruit eaten
    if (x == fruitX && y == fruitY) {
        score += 10;
        fruitX = rand() % width;
        fruitY = rand() % height;
        nTail++;
    }
}


void GameLoop() {
    Setup();
    cout << "\x1b[2J"; // Clear screen once
    while (!gameOver) {
        Draw();
        Input();
        Logic();
        Sleep(100); // speed of snake
    }
    cout << "Game Over! Final Score = " << score << endl;
}

int main() {
    bool running = true;
    while (running) {
        // Start Menu
        cout << "\x1b[2J"; // Clear screen
        cout << "==============================" << endl;
        cout << "       ASCII Snake Game        " << endl;
        cout << "==============================" << endl;
        cout << "1. Play Game" << endl;
        cout << "2. Instructions" << endl;
        cout << "3. Quit" << endl;
        cout << "Choose an option: ";

        int choice;
        cin >> choice;

        if (choice == 1) {
            GameLoop();
            cout << "Press R to Restart or Q to Quit: ";
            char c;
            cin >> c;
            if (c == 'q' || c == 'Q')
                running = false;
        }
        else if (choice == 2) {
            cout << "\nInstructions:" << endl;
            cout << "- Use W A S D to move the snake" << endl;
            cout << "- Eat '*' to grow and score points" << endl;
            cout << "- Don't run into yourself!" << endl;
            cout << "- Press X to quit during game" << endl;
            cout << "\nPress Enter to go back to menu...";
            cin.ignore();
            cin.get();
        }
        else if (choice == 3) {
            running = false;
        }
    }
    return 0;
}
