FROM amazoncorretto:22.0.2-alpine3.20

WORKDIR /app
 
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

RUN ./mvnw clean install
 
COPY src ./src
 
CMD ["./mvnw", "spring-boot:run"]