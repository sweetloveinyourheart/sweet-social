## Sweet Social

A social media web application that allows users to share moments in life, comment, like, message, and follow others. This application draws inspiration from Instagram.

Built with:
* Front-end: ReactJS, Ant Design
* Back-end: NestJS, PostgreSQL, TypeORM, GCP Bucket, Socket.io, JWT, class-validation, Swagger 
* Deployment and Infrastructure: GCP VM, Docker, NGINX

### Installation

To install and run the application, follow the steps below:

1. Clone the repository to your local machine:
   ```sh
   git clone https://github.com/Sweetloveinyourheart/sweet-social
   ```
2. Enter the required API keys and Google Cloud Platform (GCP) configurations in the docker-compose.yml file.
3. Build the application using docker-compose:
   ```sh
   docker-compose build
   ```
3. Run the application using docker-compose:
   ```sh
   docker-compose up -d
   ```