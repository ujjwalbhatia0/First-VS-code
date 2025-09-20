import pygame, sys, random

# Initialize pygame
pygame.init()

# Screen setup
WIDTH, HEIGHT = 400, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
clock = pygame.time.Clock()
font = pygame.font.SysFont("Arial", 30)

# Colors
WHITE = (255, 255, 255)
BLUE = (135, 206, 250)
GREEN = (0, 200, 0)

# Bird setup
bird = pygame.Rect(100, HEIGHT//2, 30, 30)
gravity = 0.25
bird_movement = 0

# Pipes setup
pipe_width = 70
pipe_height = 400
pipe_gap = 150
pipes = []
SPAWNPIPE = pygame.USEREVENT
pygame.time.set_timer(SPAWNPIPE, 1500)

# Score
score = 0

def draw_bird():
    pygame.draw.ellipse(screen, (255, 255, 0), bird)

def create_pipe():
    height = random.randint(100, 400)
    top_pipe = pygame.Rect(WIDTH, height - pipe_height, pipe_width, pipe_height)
    bottom_pipe = pygame.Rect(WIDTH, height + pipe_gap, pipe_width, pipe_height)
    return top_pipe, bottom_pipe

def move_pipes(pipes):
    for pipe in pipes:
        pipe.centerx -= 3
    return [pipe for pipe in pipes if pipe.right > 0]

def draw_pipes(pipes):
    for i, pipe in enumerate(pipes):
        if i % 2 == 0:
            pygame.draw.rect(screen, GREEN, pipe)  # Top pipe
        else:
            pygame.draw.rect(screen, GREEN, pipe)  # Bottom pipe

def check_collision(pipes):
    for pipe in pipes:
        if bird.colliderect(pipe):
            return False
    if bird.top <= 0 or bird.bottom >= HEIGHT:
        return False
    return True

# Game loop
running = True
game_active = True
while running:
    screen.fill(BLUE)

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE and game_active:
                bird_movement = 0
                bird_movement -= 7
            if event.key == pygame.K_SPACE and not game_active:
                game_active = True
                pipes.clear()
                bird.center = (100, HEIGHT//2)
                bird_movement = 0
                score = 0

        if event.type == SPAWNPIPE:
            pipes.extend(create_pipe())

    if game_active:
        # Bird
        bird_movement += gravity
        bird.centery += bird_movement
        draw_bird()

        # Pipes
        pipes = move_pipes(pipes)
        draw_pipes(pipes)

        # Collisions
        game_active = check_collision(pipes)

        # Score
        for pipe in pipes:
            if pipe.centerx == bird.centerx:
                score += 0.5
        score_text = font.render(f"Score: {int(score)}", True, WHITE)
        screen.blit(score_text, (10, 10))
    else:
        msg = font.render("Game Over! Press SPACE to restart", True, WHITE)
        screen.blit(msg, (20, HEIGHT//2))

    pygame.display.update()
    clock.tick(60)
