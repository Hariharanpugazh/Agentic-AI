from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from .logic import run_agentic_review

@csrf_exempt
def review_repo(request):
    if request.method == "POST":
        data = json.loads(request.body)
        repo_url = data.get("repo_url")

        if not repo_url:
            return JsonResponse({"error": "No repo_url provided"}, status=400)

        try:
            feedback = run_agentic_review(repo_url)  # Return string or dict
            return JsonResponse({"review": feedback}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
