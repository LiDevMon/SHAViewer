python -m venv env

call env\Scripts\activate.bat

pip install -r requirements.txt

cd app

py run.py

call deactivate

color a

echo "Разработчик: LiDevMon || Developer: LiDevMon"
pause