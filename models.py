import os
from dotenv import load_dotenv
from groq import Groq

def get_available_models():
    """
    Connects to the Groq API and prints a list of available models.
    """
    print("--- Checking for available Groq models ---")
    
    # 1. Load environment variables from .env file
    load_dotenv()
    
    # 2. Get the Groq API key
    groq_api_key = os.getenv("GROQ_API_KEY")
    if not groq_api_key:
        print("\n❌ ERROR: GROQ_API_KEY not found in .env file.")
        print("Please make sure your .env file is set up correctly.")
        return

    try:
        # 3. Initialize the Groq client
        client = Groq(api_key=groq_api_key)
        
        # 4. Fetch the list of models
        model_list = client.models.list()
        
        print("\n✅ Successfully fetched models. Here are the available model IDs:\n")
        
        # 5. Print the ID of each available model
        if model_list.data:
            for model in model_list.data:
                print(f"- {model.id}")
        else:
            print("No models found.")
            
        print("\nCopy one of the model IDs above and paste it into the GROQ_MODEL_NAME constant in your api_groq.py file.")

    except Exception as e:
        print(f"\n❌ ERROR: An error occurred while trying to connect to Groq.")
        print(f"Details: {e}")

if __name__ == "__main__":
    get_available_models()
