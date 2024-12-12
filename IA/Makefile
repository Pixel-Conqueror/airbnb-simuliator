PYTHON = venv/bin/python
PIP = venv/bin/pip

# Create virtual python env
init:
	@python3 -m venv venv
	@echo "Virtual env created"
	@-echo "Next, you have to execute this command: source venv/bin/activate and then make install"

install:
	@$(PIP) install -r requirements.txt


freeze:
	@$(PIP) freeze > requirements.txt
