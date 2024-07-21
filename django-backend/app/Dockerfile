FROM python:3.10-slim

RUN apt-get update && apt-get install -y procps

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/

RUN chmod +x /app/setup.sh

EXPOSE 8000

ENTRYPOINT [ "/app/setup.sh" ]
