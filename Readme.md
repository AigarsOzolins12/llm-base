# LLM Base
In other to make my life easier when it comes to the future development involving LLM's and other ML related tasks I decided to create a baseline tool stack. The idea being that this could be the baseline for any python or java app that would have to use an LLM or some other AI tool.

That currently involves:
- ollama (LLM inferrence engine)
- ollama-webui [link](https://github.com/open-webui/open-webui) (A nice UI for testing LLM's on their own)
- django-backend (A very bare bones django API for chatting with ollama model)
- postgres (DB for django backend)

The task-by-task to do list can be read below, however the overall planned additions are:
- Spring-Boot (java) / Angular
- User auth via Keycloak
- Monitoring, prometheus/grafana
- Ollama tool example (Run a pytorch model on written command)
- (Optional) Image generation


## Setup
Setup should be very straight forward.
The only requirements are: 
- docker
- ansible
- ansible-galaxy
- ansible docker community module

### Ansible docker community module installation
Requires ansible-galaxy installed
>ansible-galaxy collection install community.docker

### Run playbook
To run the playbook that will do the initial setup of the stack use this
This playbook will do:
- Create python ENV
- Activate python ENV
- Up the docker containers
- Download Mistral 7B model from Huggingface (might require to login to hugging face beforehand) (the downloadable model can be changed in ansbile/vars/local_setup_vars.yml)
- Load the downloaded model into ollama

From project root run:
> ansible-playbook -i ./inventory ./ansible/local_setup.yml -vvvv


## Testing ollama text generation endpoint by using the django backend
Replace "content" and add more messages as needed.

> curl -N -X POST http://localhost:8000/generate-ollama -H "Content-Type: application/json" -d '{"user_id":"someuserid12345","messages":[{"role":"user","content":"Why is the sky blue?"}]}'

## The great TO-DO list of things to do
- [x] Add ollama and ollama-webui
- [x] Add ansible playbook for initial local ENV setup. (ollama model download, install)
- [x] Add an example django backend
- [ ] Add example React app for consuming django-backend
- [ ] Add nginx for request management and secure django/react (user auth)
- [ ] Add monitoring and statistics for LLM usage
- [ ] Host example stack, make plays act as root only when necessary, add docker install to setup play
- [ ] Add example Java app with Spring.AI
- [ ] Add example angular for consuming spring-backend

