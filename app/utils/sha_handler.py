import json
from pathlib import Path

class StepFabricator:
    def __init__(self):
        self.steps = []

    def add_step(self, title:str='', rows:list=[], hash:str='-'):
        self.steps.append(
            {
                'code': f'{len(self.steps)+1:02}',
                'title': title,
                'rows': rows,
                'hash': hash,
                'prog': 0
            }
        )

    def convert_steps(self):
        prog_by_block = round(100 / len(self.steps), 3)
        for i in range(len(self.steps)):
            all_sum = sum([x['prog'] for x in self.steps])

            self.steps[i]['prog'] = round((prog_by_block * (i+1))) if i != 0 else prog_by_block
            
            if(i == len(self.steps)-1):
                if(all_sum < 100):
                    self.steps[i]['prog'] = 100
                    

        data = {
            "steps": self.steps
        }

        with open(f'{Path(__file__).resolve().parent}\\..\\static\\data.json', 'w', encoding='utf-8') as file:
            json.dump(data, file, ensure_ascii=False, indent=4)


if __name__ == "__main__":
    generator = StepFabricator()

    generator.add_step("Test,", ["Hello", "World!"], "010s0f0q02najkj2h1fs")
    generator.add_step("This", ["I", "Can to"], "12321fsdfasf1")
    generator.add_step("Working?", ["Do", "This"], "fsfaf121sa")

    generator.convert_steps()