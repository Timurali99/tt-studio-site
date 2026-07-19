FROM python:3.12-slim
WORKDIR /app
COPY server.py .
COPY site/ site/
CMD ["python", "server.py"]
